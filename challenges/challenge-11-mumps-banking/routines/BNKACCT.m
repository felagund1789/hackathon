BNKACCT ; Account Management Module
 ; Open, close, view, and list bank accounts
 ; Account types: SAV (Savings), CHK (Checking), FD (Fixed Deposit)
 ;
MENU ; Account Management Menu
 N OPT
AC1 ;
 W !!,"Account Management"
 W !,"=================="
 W !,"1. Open New Account"
 W !,"2. View Account"
 W !,"3. List Customer Accounts"
 W !,"4. Close Account"
 W !,"5. Account Balance Inquiry"
 W !,"B. Back"
 W !!,"Select: "
 R OPT
 I OPT="B"!(OPT="b") Q
 I OPT=1 D OPEN G AC1
 I OPT=2 D VIEW G AC1
 I OPT=3 D LISTBYC G AC1
 I OPT=4 D CLOSE G AC1
 I OPT=5 D BALINQ G AC1
 W !,"Invalid option."
 G AC1
 ;
OPEN ; Open a new account
 N CID,ATYPE,DEP,AID,RATE,TERM
 ;
 W !!,"=== Open New Account ==="
 W !,"Customer ID: " R CID Q:CID=""
 S CID=+CID
 I '$D(^CUST(CID,"NAME")) W !,"Customer not found." Q
 I ^CUST(CID,"STATUS")'="ACTIVE" W !,"Customer is not active." Q
 I $G(^CUST(CID,"KYC"))'="VERIFIED" D
 . W !,"WARNING: KYC not verified for this customer."
 . W !,"Account will be restricted until KYC is complete."
 ;
 W !,"Account Type:"
 W !,"  SAV - Savings Account"
 W !,"  CHK - Checking Account"
 W !,"  FD  - Fixed Deposit"
 W !,"Type: " R ATYPE
 S ATYPE=$$UPPER^BNKUTIL(ATYPE)
 I ATYPE'="SAV",ATYPE'="CHK",ATYPE'="FD" W !,"Invalid account type." Q
 ;
 ; Get interest rate from config
 I ATYPE="SAV" S RATE=$G(^BNKCONF("RATES","SAVINGS"),2.5)
 I ATYPE="CHK" S RATE=$G(^BNKCONF("RATES","CHECKING"),0.1)
 I ATYPE="FD" D
 . S RATE=$G(^BNKCONF("RATES","FIXEDDEP"),5.0)
 . W !,"Fixed Deposit Term (months): " R TERM
 . I +TERM<3 W !,"Minimum term is 3 months." S TERM="" Q
 . I +TERM>120 W !,"Maximum term is 120 months." S TERM="" Q
 I ATYPE="FD",TERM="" Q
 ;
 ; Minimum opening deposit
 N MINDEF
 S MINDEF=$$MINOPDEP(ATYPE)
 W !,"Minimum opening deposit: ",$$FMTCUR^BNKUTIL(MINDEF)
 W !,"Initial deposit amount: " R DEP
 S DEP=+DEP
 I DEP<MINDEF W !,"Deposit below minimum." Q
 ;
 ; Generate account number
 L +^ACCT("SEQ"):5
 I '$T W !,"System busy." Q
 S AID=$G(^ACCT("SEQ"),100000)+1
 S ^ACCT("SEQ")=AID
 L -^ACCT("SEQ")
 ;
 ; Create account record
 S ^ACCT(AID,"CUSTID")=CID
 S ^ACCT(AID,"TYPE")=ATYPE
 S ^ACCT(AID,"BAL")=DEP
 S ^ACCT(AID,"STATUS")="ACTIVE"
 S ^ACCT(AID,"OPENED")=$$NOW^BNKUTIL
 S ^ACCT(AID,"RATE")=RATE
 S ^ACCT(AID,"CURRENCY")="USD"
 I ATYPE="CHK" S ^ACCT(AID,"OVERDRAFT")=0
 I ATYPE="FD" D
 . S ^ACCT(AID,"TERM")=+TERM
 . S ^ACCT(AID,"MATURITY")=$$ADDMON^BNKUTIL($$TODAY^BNKUTIL,+TERM)
 . S ^ACCT(AID,"ORIGDEP")=DEP
 ;
 ; Customer-to-account cross-reference
 S ^ACCT("CUSTIDX",CID,AID)=""
 ;
 ; Record opening deposit as a transaction
 D RECTXN^BNKTXN(AID,"DEP",DEP,0,DEP,"Opening deposit",BNKUSER,"")
 ;
 D LOG^BNKAUDT(BNKUSER,"NEWACCT","Opened "_ATYPE_" account "_AID_" for customer "_CID)
 ;
 W !!,"Account opened successfully."
 W !,"Account Number: ",AID
 W !,"Type: ",$$TYPENAME(ATYPE)
 W !,"Interest Rate: ",RATE,"%"
 I ATYPE="FD" W !,"Maturity Date: ",$$FMTDT^BNKUTIL(^ACCT(AID,"MATURITY"))
 W !,"Balance: ",$$FMTCUR^BNKUTIL(DEP)
 Q
 ;
VIEW ; View account details
 N AID
 W !,"Account Number: " R AID Q:AID=""
 S AID=+AID
 D DISPACT(AID)
 Q
 ;
DISPACT(AID) ; Display full account details
 I '$D(^ACCT(AID,"TYPE")) W !,"Account not found." Q
 N CID S CID=^ACCT(AID,"CUSTID")
 ;
 W !!,"=== Account Details ==="
 W !,"Account #:     ",AID
 W !,"Customer:      ",^CUST(CID,"NAME","FIRST")," ",^CUST(CID,"NAME","LAST")," (ID: ",CID,")"
 W !,"Type:          ",$$TYPENAME(^ACCT(AID,"TYPE"))
 W !,"Balance:       ",$$FMTCUR^BNKUTIL(^ACCT(AID,"BAL"))
 W !,"Interest Rate: ",^ACCT(AID,"RATE"),"%"
 W !,"Status:        ",^ACCT(AID,"STATUS")
 W !,"Opened:        ",$G(^ACCT(AID,"OPENED"))
 W !,"Currency:      ",$G(^ACCT(AID,"CURRENCY"),"USD")
 ;
 I ^ACCT(AID,"TYPE")="CHK" D
 . W !,"Overdraft:     ",$$FMTCUR^BNKUTIL($G(^ACCT(AID,"OVERDRAFT"),0))
 ;
 I ^ACCT(AID,"TYPE")="FD" D
 . W !,"Original Dep:  ",$$FMTCUR^BNKUTIL($G(^ACCT(AID,"ORIGDEP")))
 . W !,"Term:          ",$G(^ACCT(AID,"TERM"))," months"
 . W !,"Maturity:      ",$$FMTDT^BNKUTIL($G(^ACCT(AID,"MATURITY")))
 ;
 ; Show last 5 transactions
 W !!,"--- Recent Transactions ---"
 N TID,CNT S CNT=0
 S TID=""
 ; walk backward through account transactions
 F  S TID=$O(^TXNLOG("ACCTIDX",AID,TID),-1) Q:TID=""  Q:CNT>=5  D
 . S CNT=CNT+1
 . W !,"  ",TID," | ",$G(^TXNLOG(TID,"TYPE"))," | ",$$FMTCUR^BNKUTIL($G(^TXNLOG(TID,"AMT")))," | ",$G(^TXNLOG(TID,"DESC"))," | ",$G(^TXNLOG(TID,"DT"))
 I CNT=0 W !,"  (no transactions)"
 Q
 ;
LISTBYC ; List all accounts for a customer
 N CID,AID
 W !,"Customer ID: " R CID Q:CID=""
 S CID=+CID
 I '$D(^CUST(CID,"NAME")) W !,"Customer not found." Q
 D ACCTSUM^BNKCUST(CID)
 Q
 ;
CLOSE ; Close an account
 N AID,BAL,CID,ATYPE
 ;
 W !,"Account Number to close: " R AID Q:AID=""
 S AID=+AID
 I '$D(^ACCT(AID,"TYPE")) W !,"Account not found." Q
 I ^ACCT(AID,"STATUS")'="ACTIVE" W !,"Account is already ",^ACCT(AID,"STATUS"),"." Q
 ;
 S BAL=^ACCT(AID,"BAL")
 S CID=^ACCT(AID,"CUSTID")
 S ATYPE=^ACCT(AID,"TYPE")
 ;
 ; Check for linked loans
 I $$HASLOAN(AID) W !,"Cannot close: account has an active loan linked to it." Q
 ;
 ; FD early closure penalty
 I ATYPE="FD" D
 . N MAT S MAT=$G(^ACCT(AID,"MATURITY"))
 . I MAT'="",MAT>$$TODAY^BNKUTIL D
 . . N PEN S PEN=BAL*0.01
 . . ; Penalty is 1% of balance for early withdrawal
 . . ; temporary fix - should be configurable (RKS 2012-03-15)
 . . W !,"Early closure penalty: ",$$FMTCUR^BNKUTIL(PEN)
 . . S BAL=BAL-PEN
 . . W !,"Amount after penalty: ",$$FMTCUR^BNKUTIL(BAL)
 ;
 W !,"Closing balance to disburse: ",$$FMTCUR^BNKUTIL(BAL)
 W !,"Confirm closure? (Y/N): "
 N ANS R ANS
 I ANS'="Y",ANS'="y" W !,"Closure cancelled." Q
 ;
 ; Record withdrawal of remaining balance
 I BAL>0 D RECTXN^BNKTXN(AID,"WDR",BAL,BAL,0,"Account closure disbursement",BNKUSER,"")
 ;
 S ^ACCT(AID,"STATUS")="CLOSED"
 S ^ACCT(AID,"CLOSED")=$$NOW^BNKUTIL
 S ^ACCT(AID,"BAL")=0
 ;
 D LOG^BNKAUDT(BNKUSER,"CLSACCT","Closed account "_AID_" balance "_BAL)
 W !,"Account ",AID," closed."
 Q
 ;
BALINQ ; Quick balance inquiry
 N AID
 W !,"Account Number: " R AID Q:AID=""
 S AID=+AID
 I '$D(^ACCT(AID,"TYPE")) W !,"Account not found." Q
 W !,"Account: ",AID
 W !,"Type: ",$$TYPENAME(^ACCT(AID,"TYPE"))
 W !,"Balance: ",$$FMTCUR^BNKUTIL(^ACCT(AID,"BAL"))
 W !,"Status: ",^ACCT(AID,"STATUS")
 Q
 ;
TYPENAME(CD) ; Account type code to full name
 I CD="SAV" Q "Savings Account"
 I CD="CHK" Q "Checking Account"
 I CD="FD" Q "Fixed Deposit"
 Q CD
 ;
MINOPDEP(ATYPE) ; Minimum opening deposit by account type
 I ATYPE="SAV" Q 100
 I ATYPE="CHK" Q 50
 I ATYPE="FD" Q 1000
 Q 0
 ;
HASLOAN(AID) ; Check if account has active linked loan
 N LID,CID,RES
 S RES=0
 S CID=^ACCT(AID,"CUSTID")
 S LID=""
 F  S LID=$O(^LOAN("CUSTIDX",CID,LID)) Q:LID=""  D
 . I ^LOAN(LID,"ACCTID")=AID,^LOAN(LID,"STATUS")="ACTIVE" S RES=1
 Q RES
 ;
GETBAL(AID) ; Extrinsic function - return balance for account
 I '$D(^ACCT(AID,"BAL")) Q -1
 Q +^ACCT(AID,"BAL")
