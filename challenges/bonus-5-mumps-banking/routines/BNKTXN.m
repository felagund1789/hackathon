BNKTXN ; Transaction Processing Module
 ; Handles deposits, withdrawals, transfers, and fee charging
 ; This is the core transactional engine of the banking system
 ;
MENU ; Transaction Menu
 N OPT
TX1 ;
 W !!,"Transactions"
 W !,"============"
 W !,"1. Deposit"
 W !,"2. Withdrawal"
 W !,"3. Transfer Between Accounts"
 W !,"4. View Transaction History"
 W !,"B. Back"
 W !!,"Select: "
 R OPT
 I OPT="B"!(OPT="b") Q
 I OPT=1 D DEPOSIT G TX1
 I OPT=2 D WITHDRAW G TX1
 I OPT=3 D TRANSFER G TX1
 I OPT=4 D TXNHIST G TX1
 W !,"Invalid option."
 G TX1
 ;
DEPOSIT ; Process a deposit
 N AID,AMT
 ;
 W !!,"=== Deposit ==="
 W !,"Account Number: " R AID Q:AID=""
 S AID=+AID
 I '$D(^ACCT(AID,"TYPE")) W !,"Account not found." Q
 I ^ACCT(AID,"STATUS")'="ACTIVE" W !,"Account is not active." Q
 I ^ACCT(AID,"TYPE")="FD" W !,"Cannot deposit into a Fixed Deposit account." Q
 ;
 W !,"Current Balance: ",$$FMTCUR^BNKUTIL(^ACCT(AID,"BAL"))
 W !,"Deposit Amount: $" R AMT
 S AMT=+AMT
 I AMT<=0 W !,"Amount must be positive." Q
 I AMT>100000 D
 . W !,"NOTE: Large deposit. CTR filing may be required."
 . D LOG^BNKAUDT(BNKUSER,"LGDEP","Large deposit $"_AMT_" to account "_AID)
 ;
 ; Perform deposit
 L +^ACCT(AID):10
 I '$T W !,"Account locked by another process." Q
 ;
 N OLDB S OLDB=^ACCT(AID,"BAL")
 N NEWB S NEWB=OLDB+AMT
 S ^ACCT(AID,"BAL")=NEWB
 ;
 L -^ACCT(AID)
 ;
 D RECTXN(AID,"DEP",AMT,OLDB,NEWB,"Cash deposit",BNKUSER,"")
 ;
 W !,"Deposit successful."
 W !,"Previous Balance: ",$$FMTCUR^BNKUTIL(OLDB)
 W !,"Deposited:        ",$$FMTCUR^BNKUTIL(AMT)
 W !,"New Balance:      ",$$FMTCUR^BNKUTIL(NEWB)
 Q
 ;
WITHDRAW ; Process a withdrawal
 N AID,AMT,OLDB,NEWB
 ;
 W !!,"=== Withdrawal ==="
 W !,"Account Number: " R AID Q:AID=""
 S AID=+AID
 I '$D(^ACCT(AID,"TYPE")) W !,"Account not found." Q
 I ^ACCT(AID,"STATUS")'="ACTIVE" W !,"Account is not active." Q
 I ^ACCT(AID,"TYPE")="FD" W !,"Cannot withdraw from Fixed Deposit. Use account closure." Q
 ;
 W !,"Current Balance: ",$$FMTCUR^BNKUTIL(^ACCT(AID,"BAL"))
 W !,"Withdrawal Amount: $" R AMT
 S AMT=+AMT
 I AMT<=0 W !,"Amount must be positive." Q
 ;
 ; Daily withdrawal limit check
 I '$$CHKLIMIT(AID,AMT) W !,"Daily withdrawal limit exceeded." Q
 ;
 S OLDB=^ACCT(AID,"BAL")
 ;
 ; Overdraft logic for checking accounts
 I ^ACCT(AID,"TYPE")="CHK" D
 . N AVAIL S AVAIL=OLDB+$G(^ACCT(AID,"OVERDRAFT"),0)
 . I AMT>AVAIL W !,"Insufficient funds (including overdraft)." S AMT=-1
 . I AMT>OLDB,AMT>0 D
 . . W !,"NOTE: This withdrawal will use overdraft protection."
 . . W !,"Overdraft amount: ",$$FMTCUR^BNKUTIL(AMT-OLDB)
 E  D
 . ; Savings - no overdraft
 . I AMT>OLDB W !,"Insufficient funds." S AMT=-1
 ;
 I AMT=-1 Q
 ;
 ; Process withdrawal
 L +^ACCT(AID):10
 I '$T W !,"Account locked." Q
 ;
 S NEWB=OLDB-AMT
 S ^ACCT(AID,"BAL")=NEWB
 ;
 L -^ACCT(AID)
 ;
 D RECTXN(AID,"WDR",AMT,OLDB,NEWB,"Cash withdrawal",BNKUSER,"")
 ;
 W !,"Withdrawal successful."
 W !,"Previous Balance: ",$$FMTCUR^BNKUTIL(OLDB)
 W !,"Withdrawn:        ",$$FMTCUR^BNKUTIL(AMT)
 W !,"New Balance:      ",$$FMTCUR^BNKUTIL(NEWB)
 Q
 ;
TRANSFER ; Transfer between two accounts
 N FAID,TAID,AMT,FOLDB,FNEWB,TOLDB,TNEWB
 ;
 W !!,"=== Account Transfer ==="
 W !,"From Account: " R FAID Q:FAID=""
 S FAID=+FAID
 I '$D(^ACCT(FAID,"TYPE")) W !,"Source account not found." Q
 I ^ACCT(FAID,"STATUS")'="ACTIVE" W !,"Source account is not active." Q
 I ^ACCT(FAID,"TYPE")="FD" W !,"Cannot transfer from Fixed Deposit." Q
 ;
 W !,"To Account: " R TAID Q:TAID=""
 S TAID=+TAID
 I '$D(^ACCT(TAID,"TYPE")) W !,"Destination account not found." Q
 I ^ACCT(TAID,"STATUS")'="ACTIVE" W !,"Destination account is not active." Q
 I ^ACCT(TAID,"TYPE")="FD" W !,"Cannot transfer into Fixed Deposit." Q
 I FAID=TAID W !,"Source and destination cannot be the same." Q
 ;
 W !,"Source Balance: ",$$FMTCUR^BNKUTIL(^ACCT(FAID,"BAL"))
 W !,"Transfer Amount: $" R AMT
 S AMT=+AMT
 I AMT<=0 W !,"Amount must be positive." Q
 ;
 ; Transfer limit
 N TLIMIT S TLIMIT=$G(^BNKCONF("LIMITS","TRANSFER"),50000)
 I AMT>TLIMIT W !,"Transfer exceeds limit of ",$$FMTCUR^BNKUTIL(TLIMIT),"." Q
 ;
 S FOLDB=^ACCT(FAID,"BAL")
 I AMT>FOLDB W !,"Insufficient funds." Q
 ;
 ; Acquire locks on BOTH accounts - always lock lower ID first to prevent deadlock
 ; BUG: The original code locked in arbitrary order (ticket #3887)
 ; Fixed 2018-06 by JBP - always lock lower account first
 N LOCKFIRST,LOCKSECOND
 I FAID<TAID S LOCKFIRST=FAID,LOCKSECOND=TAID
 E  S LOCKFIRST=TAID,LOCKSECOND=FAID
 ;
 L +^ACCT(LOCKFIRST):10
 I '$T W !,"System busy, try again." Q
 L +^ACCT(LOCKSECOND):10
 I '$T L -^ACCT(LOCKFIRST) W !,"System busy, try again." Q
 ;
 ; Re-check balance under lock
 S FOLDB=^ACCT(FAID,"BAL")
 I AMT>FOLDB D  Q
 . L -^ACCT(LOCKSECOND)
 . L -^ACCT(LOCKFIRST)
 . W !,"Insufficient funds (balance changed)."
 ;
 S TOLDB=^ACCT(TAID,"BAL")
 S FNEWB=FOLDB-AMT
 S TNEWB=TOLDB+AMT
 ;
 S ^ACCT(FAID,"BAL")=FNEWB
 S ^ACCT(TAID,"BAL")=TNEWB
 ;
 L -^ACCT(LOCKSECOND)
 L -^ACCT(LOCKFIRST)
 ;
 ; Record both sides of the transfer with cross-references
 N TXID1,TXID2
 S TXID1=$$NEXTTXN
 D RECTXN2(TXID1,FAID,"TRF",AMT,FOLDB,FNEWB,"Transfer to "_TAID,BNKUSER,"")
 S TXID2=$$NEXTTXN
 D RECTXN2(TXID2,TAID,"TRF",AMT,TOLDB,TNEWB,"Transfer from "_FAID,BNKUSER,"")
 ; Cross-reference the paired transactions
 S ^TXNLOG(TXID1,"REFID")=TXID2
 S ^TXNLOG(TXID2,"REFID")=TXID1
 ;
 D LOG^BNKAUDT(BNKUSER,"TRANSFER","$"_AMT_" from "_FAID_" to "_TAID)
 ;
 W !,"Transfer successful."
 W !,"From ",FAID,": ",$$FMTCUR^BNKUTIL(FOLDB)," -> ",$$FMTCUR^BNKUTIL(FNEWB)
 W !,"To   ",TAID,": ",$$FMTCUR^BNKUTIL(TOLDB)," -> ",$$FMTCUR^BNKUTIL(TNEWB)
 Q
 ;
RECTXN(AID,TYPE,AMT,BALBEF,BALAFT,DESC,TELLER,REFID) ; Record a transaction
 ; Generates its own transaction ID
 N TID
 S TID=$$NEXTTXN
 D RECTXN2(TID,AID,TYPE,AMT,BALBEF,BALAFT,DESC,TELLER,REFID)
 Q
 ;
RECTXN2(TID,AID,TYPE,AMT,BALBEF,BALAFT,DESC,TELLER,REFID) ; Record txn with given ID
 S ^TXNLOG(TID,"ACCTID")=AID
 S ^TXNLOG(TID,"TYPE")=TYPE
 S ^TXNLOG(TID,"AMT")=AMT
 S ^TXNLOG(TID,"BALBEF")=BALBEF
 S ^TXNLOG(TID,"BALAFT")=BALAFT
 S ^TXNLOG(TID,"DESC")=DESC
 S ^TXNLOG(TID,"DT")=$$NOW^BNKUTIL
 S ^TXNLOG(TID,"TELLER")=TELLER
 S ^TXNLOG(TID,"REFID")=REFID
 ;
 ; Maintain indexes
 S ^TXNLOG("ACCTIDX",AID,TID)=""
 N DT S DT=$P($$NOW^BNKUTIL," ",1)
 S ^TXNLOG("DTIDX",DT,TID)=""
 Q
 ;
NEXTTXN() ; Generate next transaction ID (atomic)
 N TID
 L +^TXNLOG("SEQ"):5
 I '$T Q -1
 S TID=$G(^TXNLOG("SEQ"),500000)+1
 S ^TXNLOG("SEQ")=TID
 L -^TXNLOG("SEQ")
 Q TID
 ;
TXNHIST ; View transaction history for an account
 N AID,TID,CNT,MAXR,FILT
 ;
 W !,"Account Number: " R AID Q:AID=""
 S AID=+AID
 I '$D(^ACCT(AID,"TYPE")) W !,"Account not found." Q
 ;
 W !,"How many records? (default 20): " R MAXR
 S:MAXR="" MAXR=20
 S MAXR=+MAXR
 I MAXR<1 S MAXR=20
 I MAXR>500 S MAXR=500
 ;
 W !,"Filter by type (DEP/WDR/TRF/INT/FEE/ALL, default ALL): " R FILT
 S:FILT="" FILT="ALL"
 S FILT=$$UPPER^BNKUTIL(FILT)
 ;
 W !!,"Transaction History for Account ",AID
 W !,"Type: ",$$TYPENAME^BNKACCT(^ACCT(AID,"TYPE"))
 W !,"Current Balance: ",$$FMTCUR^BNKUTIL(^ACCT(AID,"BAL"))
 W !
 W !,"TxnID",?10,"Type",?16,"Amount",?30,"Bal Before",?45,"Bal After",?60,"Description"
 W !,"-----",?10,"----",?16,"------",?30,"----------",?45,"---------",?60,"-----------"
 ;
 S TID="",CNT=0
 F  S TID=$O(^TXNLOG("ACCTIDX",AID,TID),-1) Q:TID=""  Q:CNT>=MAXR  D
 . I FILT'="ALL",$G(^TXNLOG(TID,"TYPE"))'=FILT Q
 . S CNT=CNT+1
 . W !,TID,?10,$G(^TXNLOG(TID,"TYPE")),?16,$$FMTCUR^BNKUTIL($G(^TXNLOG(TID,"AMT")))
 . W ?30,$$FMTCUR^BNKUTIL($G(^TXNLOG(TID,"BALBEF"))),?45,$$FMTCUR^BNKUTIL($G(^TXNLOG(TID,"BALAFT")))
 . W ?60,$E($G(^TXNLOG(TID,"DESC")),1,30)
 ;
 I CNT=0 W !,"No transactions found."
 E  W !!,"Showing ",CNT," transaction(s)."
 Q
 ;
CHKLIMIT(AID,AMT) ; Check daily withdrawal limit
 ; Returns 1 if OK, 0 if limit exceeded
 N LIMIT,TODAY,TID,TOTAL
 S LIMIT=$G(^BNKCONF("LIMITS","DAILYWD"),10000)
 S TODAY=$P($$NOW^BNKUTIL," ",1)
 S TOTAL=0
 ;
 ; Sum today's withdrawals for this account
 S TID=""
 F  S TID=$O(^TXNLOG("ACCTIDX",AID,TID)) Q:TID=""  D
 . I $G(^TXNLOG(TID,"TYPE"))="WDR" D
 . . I $P($G(^TXNLOG(TID,"DT"))," ",1)=TODAY D
 . . . S TOTAL=TOTAL+$G(^TXNLOG(TID,"AMT"))
 ;
 I (TOTAL+AMT)>LIMIT D  Q 0
 . W !,"Today's withdrawals: ",$$FMTCUR^BNKUTIL(TOTAL)
 . W !,"Limit: ",$$FMTCUR^BNKUTIL(LIMIT)
 . W !,"Remaining: ",$$FMTCUR^BNKUTIL(LIMIT-TOTAL)
 ;
 Q 1
 ;
CHRGFEE(AID,AMT,DESC) ; Charge a fee to an account (used by batch)
 I '$D(^ACCT(AID,"TYPE")) Q
 I ^ACCT(AID,"STATUS")'="ACTIVE" Q
 ;
 N OLDB,NEWB
 L +^ACCT(AID):10
 I '$T Q
 ;
 S OLDB=^ACCT(AID,"BAL")
 S NEWB=OLDB-AMT
 S ^ACCT(AID,"BAL")=NEWB
 ;
 L -^ACCT(AID)
 ;
 D RECTXN(AID,"FEE",AMT,OLDB,NEWB,$G(DESC,"Service fee"),"SYSTEM","")
 Q
 ;
CREDIT(AID,AMT,DESC) ; Credit an account (used by batch for interest)
 I '$D(^ACCT(AID,"TYPE")) Q
 I ^ACCT(AID,"STATUS")'="ACTIVE" Q
 ;
 N OLDB,NEWB
 L +^ACCT(AID):10
 I '$T Q
 ;
 S OLDB=^ACCT(AID,"BAL")
 S NEWB=OLDB+AMT
 S ^ACCT(AID,"BAL")=NEWB
 ;
 L -^ACCT(AID)
 ;
 D RECTXN(AID,"INT",AMT,OLDB,NEWB,$G(DESC,"Interest credit"),"SYSTEM","")
 Q
