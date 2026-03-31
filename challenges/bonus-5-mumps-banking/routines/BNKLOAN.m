BNKLOAN ; Loan Management Module
 ; Loan origination, payments, payoff, and amortization
 ;
MENU ; Loan Management Menu
 N OPT
LN1 ;
 W !!,"Loan Management"
 W !,"==============="
 W !,"1. Apply for Loan"
 W !,"2. Make Payment"
 W !,"3. View Loan Details"
 W !,"4. Loan Payoff Quote"
 W !,"5. Amortization Schedule"
 W !,"B. Back"
 W !!,"Select: "
 R OPT
 I OPT="B"!(OPT="b") Q
 I OPT=1 D APPLY G LN1
 I OPT=2 D PAYMENT G LN1
 I OPT=3 D VIEW G LN1
 I OPT=4 D PAYOFF G LN1
 I OPT=5 D AMORT G LN1
 W !,"Invalid option."
 G LN1
 ;
APPLY ; Apply for a new loan
 N CID,AID,PRINC,RATE,TERM,MONTHLY,LID
 ;
 W !!,"=== Loan Application ==="
 W !,"Customer ID: " R CID Q:CID=""
 S CID=+CID
 I '$D(^CUST(CID,"NAME")) W !,"Customer not found." Q
 I ^CUST(CID,"STATUS")'="ACTIVE" W !,"Customer must be active." Q
 I $G(^CUST(CID,"KYC"))'="VERIFIED" W !,"KYC must be verified for loans." Q
 ;
 ; Check existing loan count - max 3 active loans
 N LCNT,LX S LCNT=0,LX=""
 F  S LX=$O(^LOAN("CUSTIDX",CID,LX)) Q:LX=""  D
 . I $G(^LOAN(LX,"STATUS"))="ACTIVE" S LCNT=LCNT+1
 I LCNT>=3 W !,"Customer already has 3 active loans. Maximum reached." Q
 ;
 W !,"Disbursement Account: " R AID Q:AID=""
 S AID=+AID
 I '$D(^ACCT(AID,"TYPE")) W !,"Account not found." Q
 I ^ACCT(AID,"CUSTID")'=CID W !,"Account does not belong to this customer." Q
 I ^ACCT(AID,"STATUS")'="ACTIVE" W !,"Account must be active." Q
 ;
 S RATE=$G(^BNKCONF("RATES","LOAN"),8.5)
 W !,"Loan interest rate: ",RATE,"%"
 ;
 W !,"Principal amount: $" R PRINC
 S PRINC=+PRINC
 I PRINC<1000 W !,"Minimum loan amount is $1,000." Q
 I PRINC>500000 W !,"Maximum loan amount is $500,000." Q
 ;
 W !,"Term (months, 12-360): " R TERM
 S TERM=+TERM
 I TERM<12!(TERM>360) W !,"Term must be between 12 and 360 months." Q
 ;
 ; Calculate monthly payment
 S MONTHLY=$$CALCPMT(PRINC,RATE,TERM)
 ;
 W !!,"--- Loan Summary ---"
 W !,"Principal:       ",$$FMTCUR^BNKUTIL(PRINC)
 W !,"Rate:            ",RATE,"%"
 W !,"Term:            ",TERM," months"
 W !,"Monthly Payment: ",$$FMTCUR^BNKUTIL(MONTHLY)
 W !,"Total Interest:  ",$$FMTCUR^BNKUTIL((MONTHLY*TERM)-PRINC)
 W !,"Total Cost:      ",$$FMTCUR^BNKUTIL(MONTHLY*TERM)
 ;
 W !!,"Approve loan? (Y/N): "
 N ANS R ANS
 I ANS'="Y",ANS'="y" W !,"Loan application cancelled." Q
 ;
 ; Generate loan ID
 L +^LOAN("SEQ"):5
 I '$T W !,"System busy." Q
 S LID=$G(^LOAN("SEQ"),200000)+1
 S ^LOAN("SEQ")=LID
 L -^LOAN("SEQ")
 ;
 ; Create loan record
 S ^LOAN(LID,"CUSTID")=CID
 S ^LOAN(LID,"ACCTID")=AID
 S ^LOAN(LID,"PRINCIPAL")=PRINC
 S ^LOAN(LID,"RATE")=RATE
 S ^LOAN(LID,"TERM")=TERM
 S ^LOAN(LID,"MONTHLY")=MONTHLY
 S ^LOAN(LID,"BALANCE")=PRINC
 S ^LOAN(LID,"STATUS")="ACTIVE"
 S ^LOAN(LID,"DISBDT")=$$NOW^BNKUTIL
 S ^LOAN(LID,"PAIDMON")=0
 ;
 ; Calculate next payment date (1 month from now)
 S ^LOAN(LID,"NEXTPMT")=$$ADDMON^BNKUTIL($$TODAY^BNKUTIL,1)
 ;
 ; Customer-to-loan cross-reference
 S ^LOAN("CUSTIDX",CID,LID)=""
 ;
 ; Disburse loan - credit the account
 D CREDIT^BNKTXN(AID,PRINC,"Loan disbursement #"_LID)
 ;
 D LOG^BNKAUDT(BNKUSER,"NEWLOAN","Loan "_LID_" $"_PRINC_" to customer "_CID)
 ;
 W !!,"Loan approved and disbursed."
 W !,"Loan ID: ",LID
 W !,"Funds deposited to account ",AID
 Q
 ;
PAYMENT ; Make a loan payment
 N LID,AMT,CID,AID,INTPOR,PRINPOR,OLDB
 ;
 W !!,"=== Loan Payment ==="
 W !,"Loan ID: " R LID Q:LID=""
 S LID=+LID
 I '$D(^LOAN(LID,"STATUS")) W !,"Loan not found." Q
 I ^LOAN(LID,"STATUS")'="ACTIVE" W !,"Loan is not active (status: ",^LOAN(LID,"STATUS"),")." Q
 ;
 S CID=^LOAN(LID,"CUSTID")
 S AID=^LOAN(LID,"ACCTID")
 ;
 W !,"Loan Balance:    ",$$FMTCUR^BNKUTIL(^LOAN(LID,"BALANCE"))
 W !,"Monthly Payment: ",$$FMTCUR^BNKUTIL(^LOAN(LID,"MONTHLY"))
 W !,"Payment Source Account: ",AID," (Balance: ",$$FMTCUR^BNKUTIL(^ACCT(AID,"BAL")),")"
 ;
 N DFLT S DFLT=^LOAN(LID,"MONTHLY")
 ; Don't overpay beyond balance
 I DFLT>^LOAN(LID,"BALANCE") S DFLT=^LOAN(LID,"BALANCE")
 ;
 W !,"Payment amount (default ",$$FMTCUR^BNKUTIL(DFLT),"): $" R AMT
 S:AMT="" AMT=DFLT
 S AMT=+AMT
 I AMT<=0 W !,"Amount must be positive." Q
 I AMT>^LOAN(LID,"BALANCE") D
 . W !,"Payment exceeds loan balance. Adjusting to ",$$FMTCUR^BNKUTIL(^LOAN(LID,"BALANCE"))
 . S AMT=^LOAN(LID,"BALANCE")
 ;
 ; Check account has sufficient funds
 I AMT>^ACCT(AID,"BAL") W !,"Insufficient funds in account ",AID,"." Q
 ;
 ; Split payment into interest and principal portions
 S OLDB=^LOAN(LID,"BALANCE")
 S INTPOR=$$INTPART(OLDB,^LOAN(LID,"RATE"))
 I INTPOR>AMT S INTPOR=AMT  ; if payment less than interest portion
 S PRINPOR=AMT-INTPOR
 ;
 ; Debit the source account
 L +^ACCT(AID):10
 I '$T W !,"System busy." Q
 N AOLDB,ANEWB
 S AOLDB=^ACCT(AID,"BAL")
 I AMT>AOLDB L -^ACCT(AID) W !,"Insufficient funds." Q
 S ANEWB=AOLDB-AMT
 S ^ACCT(AID,"BAL")=ANEWB
 L -^ACCT(AID)
 ;
 D RECTXN^BNKTXN(AID,"LNPMT",AMT,AOLDB,ANEWB,"Loan payment #"_LID,BNKUSER,"")
 ;
 ; Update loan balance
 N NEWB S NEWB=OLDB-PRINPOR
 I NEWB<0.01 S NEWB=0  ; handle floating point
 S ^LOAN(LID,"BALANCE")=NEWB
 S ^LOAN(LID,"PAIDMON")=^LOAN(LID,"PAIDMON")+1
 S ^LOAN(LID,"LASTPMT")=$$NOW^BNKUTIL
 S ^LOAN(LID,"NEXTPMT")=$$ADDMON^BNKUTIL($$TODAY^BNKUTIL,1)
 ;
 ; Check if loan is fully paid
 I NEWB=0 D
 . S ^LOAN(LID,"STATUS")="PAID"
 . S ^LOAN(LID,"PAIDDT")=$$NOW^BNKUTIL
 . W !,"*** LOAN FULLY PAID ***"
 ;
 W !!,"Payment applied."
 W !,"Total Payment:     ",$$FMTCUR^BNKUTIL(AMT)
 W !,"  Interest:        ",$$FMTCUR^BNKUTIL(INTPOR)
 W !,"  Principal:       ",$$FMTCUR^BNKUTIL(PRINPOR)
 W !,"Remaining Balance: ",$$FMTCUR^BNKUTIL(NEWB)
 I NEWB>0 W !,"Payments Made:     ",^LOAN(LID,"PAIDMON")," of ",^LOAN(LID,"TERM")
 ;
 D LOG^BNKAUDT(BNKUSER,"LNPMT","Payment $"_AMT_" on loan "_LID_" remaining $"_NEWB)
 Q
 ;
VIEW ; View loan details
 N LID
 W !,"Loan ID: " R LID Q:LID=""
 S LID=+LID
 I '$D(^LOAN(LID,"STATUS")) W !,"Loan not found." Q
 D DISPLOAN(LID)
 Q
 ;
DISPLOAN(LID) ; Display full loan details
 N CID S CID=^LOAN(LID,"CUSTID")
 ;
 W !!,"=== Loan Details ==="
 W !,"Loan ID:       ",LID
 W !,"Customer:      ",^CUST(CID,"NAME","FIRST")," ",^CUST(CID,"NAME","LAST")," (ID: ",CID,")"
 W !,"Account:       ",^LOAN(LID,"ACCTID")
 W !,"Principal:     ",$$FMTCUR^BNKUTIL(^LOAN(LID,"PRINCIPAL"))
 W !,"Rate:          ",^LOAN(LID,"RATE"),"%"
 W !,"Term:          ",^LOAN(LID,"TERM")," months"
 W !,"Monthly Pmt:   ",$$FMTCUR^BNKUTIL(^LOAN(LID,"MONTHLY"))
 W !,"Balance:       ",$$FMTCUR^BNKUTIL(^LOAN(LID,"BALANCE"))
 W !,"Status:        ",^LOAN(LID,"STATUS")
 W !,"Disbursed:     ",$G(^LOAN(LID,"DISBDT"))
 W !,"Payments Made: ",$G(^LOAN(LID,"PAIDMON"),0)
 I $G(^LOAN(LID,"LASTPMT"))'="" W !,"Last Payment:  ",^LOAN(LID,"LASTPMT")
 I ^LOAN(LID,"STATUS")="ACTIVE" W !,"Next Payment:  ",$G(^LOAN(LID,"NEXTPMT"))
 I ^LOAN(LID,"STATUS")="PAID" W !,"Paid Off:      ",$G(^LOAN(LID,"PAIDDT"))
 Q
 ;
PAYOFF ; Calculate loan payoff amount
 N LID,BAL,INTDUE
 W !,"Loan ID: " R LID Q:LID=""
 S LID=+LID
 I '$D(^LOAN(LID,"STATUS")) W !,"Loan not found." Q
 I ^LOAN(LID,"STATUS")'="ACTIVE" W !,"Loan is not active." Q
 ;
 S BAL=^LOAN(LID,"BALANCE")
 ; Accrue interest up to today
 S INTDUE=$$INTPART(BAL,^LOAN(LID,"RATE"))
 ;
 W !!,"=== Payoff Quote ==="
 W !,"Outstanding Principal: ",$$FMTCUR^BNKUTIL(BAL)
 W !,"Accrued Interest:      ",$$FMTCUR^BNKUTIL(INTDUE)
 W !,"Payoff Amount:         ",$$FMTCUR^BNKUTIL(BAL+INTDUE)
 W !,"Quote valid through:   ",$$FMTDT^BNKUTIL($$TODAY^BNKUTIL)
 Q
 ;
AMORT ; Display amortization schedule
 N LID,BAL,RATE,MONTHLY,TERM,I,INTPOR,PRINPOR,TOTINT
 ;
 W !,"Loan ID: " R LID Q:LID=""
 S LID=+LID
 I '$D(^LOAN(LID,"STATUS")) W !,"Loan not found." Q
 ;
 S BAL=^LOAN(LID,"PRINCIPAL")
 S RATE=^LOAN(LID,"RATE")
 S MONTHLY=^LOAN(LID,"MONTHLY")
 S TERM=^LOAN(LID,"TERM")
 S TOTINT=0
 ;
 W !!,"=== Amortization Schedule ==="
 W !,"Loan ID: ",LID,"  Principal: ",$$FMTCUR^BNKUTIL(BAL)
 W !,"Rate: ",RATE,"%  Term: ",TERM," months  Monthly: ",$$FMTCUR^BNKUTIL(MONTHLY)
 W !
 W !,"Month",?8,"Payment",?22,"Interest",?36,"Principal",?50,"Balance"
 W !,"-----",?8,"-------",?22,"--------",?36,"---------",?50,"-------"
 ;
 F I=1:1:TERM D  Q:BAL<=0
 . S INTPOR=$$INTPART(BAL,RATE)
 . S PRINPOR=MONTHLY-INTPOR
 . ; Last payment adjustment
 . I PRINPOR>BAL S PRINPOR=BAL S MONTHLY=INTPOR+PRINPOR
 . S BAL=BAL-PRINPOR
 . I BAL<0.01 S BAL=0
 . S TOTINT=TOTINT+INTPOR
 . W !,$$RJUST^BNKUTIL(I,5),?8,$$FMTCUR^BNKUTIL(MONTHLY),?22,$$FMTCUR^BNKUTIL(INTPOR),?36,$$FMTCUR^BNKUTIL(PRINPOR),?50,$$FMTCUR^BNKUTIL(BAL)
 ;
 W !!,"Total Interest Paid: ",$$FMTCUR^BNKUTIL(TOTINT)
 Q
 ;
CALCPMT(P,R,N) ; Calculate monthly payment (PMT formula)
 ; P = principal, R = annual rate %, N = number of months
 ; PMT = P * [r(1+r)^n] / [(1+r)^n - 1]  where r = monthly rate
 N MR,PN,PMT
 S MR=R/100/12
 I MR=0 Q P/N  ; 0% interest edge case
 S PN=(1+MR)**N
 S PMT=P*(MR*PN)/(PN-1)
 ; Round to 2 decimal places
 S PMT=$J(PMT,0,2)
 Q PMT
 ;
INTPART(BAL,RATE) ; Calculate one month's interest portion
 ; Standard 30/360 day count convention
 N MI
 S MI=BAL*(RATE/100/12)
 S MI=$J(MI,0,2)
 Q MI
