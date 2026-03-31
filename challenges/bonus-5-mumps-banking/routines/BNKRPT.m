BNKRPT ; Reports Module
 ; Account statements, transaction reports, loan reports, portfolio summary
 ;
MENU ; Reports Menu
 N OPT
RP1 ;
 W !!,"Reports"
 W !,"======="
 W !,"1. Account Statement"
 W !,"2. Daily Transaction Report"
 W !,"3. Customer Portfolio Report"
 W !,"4. Loan Portfolio Summary"
 W !,"5. Account Type Summary"
 W !,"B. Back"
 W !!,"Select: "
 R OPT
 I OPT="B"!(OPT="b") Q
 I OPT=1 D ACCTSTMT G RP1
 I OPT=2 D DAILYRPT G RP1
 I OPT=3 D CUSTRPT G RP1
 I OPT=4 D LOANRPT G RP1
 I OPT=5 D TYPESUMM G RP1
 W !,"Invalid option."
 G RP1
 ;
ACCTSTMT ; Generate account statement
 N AID,FROM,TO,TID,RUNBAL,CNT
 ;
 W !,"Account Number: " R AID Q:AID=""
 S AID=+AID
 I '$D(^ACCT(AID,"TYPE")) W !,"Account not found." Q
 ;
 W !,"From date (YYYYMMDD, blank for all): " R FROM
 W !,"To date (YYYYMMDD, blank for today): " R TO
 S:TO="" TO=$$TODAY^BNKUTIL
 ;
 N CID S CID=^ACCT(AID,"CUSTID")
 ;
 W !!,"================================================================="
 W !,"                    ACCOUNT STATEMENT"
 W !,"================================================================="
 W !,"Account:  ",AID,"          Type: ",$$TYPENAME^BNKACCT(^ACCT(AID,"TYPE"))
 W !,"Customer: ",^CUST(CID,"NAME","FIRST")," ",^CUST(CID,"NAME","LAST")
 W !,"Period:   ",$S(FROM'="":$$FMTDT^BNKUTIL(FROM),1:"Account Opening")," to ",$$FMTDT^BNKUTIL(TO)
 W !,"Generated: ",$$NOW^BNKUTIL
 W !,"================================================================="
 W !
 W !,"Date",?18,"TxnID",?28,"Type",?34,"Amount",?48,"Balance",?62,"Description"
 W !,"----",?18,"-----",?28,"----",?34,"------",?48,"-------",?62,"-----------"
 ;
 S TID="",CNT=0
 F  S TID=$O(^TXNLOG("ACCTIDX",AID,TID)) Q:TID=""  D
 . N DT S DT=$P($G(^TXNLOG(TID,"DT"))," ",1)
 . ; Apply date filter
 . I FROM'="",DT<FROM Q
 . I DT>TO Q
 . ;
 . S CNT=CNT+1
 . N TTYPE S TTYPE=$G(^TXNLOG(TID,"TYPE"))
 . N AMT S AMT=+$G(^TXNLOG(TID,"AMT"))
 . N BAFT S BAFT=+$G(^TXNLOG(TID,"BALAFT"))
 . N DSC S DSC=$E($G(^TXNLOG(TID,"DESC")),1,25)
 . ;
 . ; Show amount with +/- sign
 . N DISP
 . I TTYPE="DEP"!(TTYPE="INT")!(TTYPE="TRF"&(^TXNLOG(TID,"BALBEF")<BAFT)) S DISP="+"_$$FMTCUR^BNKUTIL(AMT)
 . E  S DISP="-"_$$FMTCUR^BNKUTIL(AMT)
 . ;
 . W !,DT,?18,TID,?28,TTYPE,?34,DISP,?48,$$FMTCUR^BNKUTIL(BAFT),?62,DSC
 ;
 W !
 W !,"-----------------------------------------------------------------"
 W !,"Current Balance: ",$$FMTCUR^BNKUTIL(^ACCT(AID,"BAL"))
 W !,"Total Transactions: ",CNT
 W !,"================================================================="
 ;
 D LOG^BNKAUDT(BNKUSER,"REPORT","Statement generated for account "_AID)
 Q
 ;
DAILYRPT ; Daily transaction report
 N DT,TID,CNT,TOTDEP,TOTWDR,TOTTRN
 ;
 W !,"Report date (YYYYMMDD, blank for today): " R DT
 S:DT="" DT=$$TODAY^BNKUTIL
 ;
 S TOTDEP=0,TOTWDR=0,TOTTRN=0,CNT=0
 ;
 W !!,"================================================================="
 W !,"              DAILY TRANSACTION REPORT"
 W !,"              Date: ",$$FMTDT^BNKUTIL(DT)
 W !,"================================================================="
 W !
 W !,"TxnID",?10,"Account",?20,"Type",?26,"Amount",?40,"Teller",?50,"Description"
 W !,"-----",?10,"-------",?20,"----",?26,"------",?40,"------",?50,"-----------"
 ;
 S TID=""
 F  S TID=$O(^TXNLOG("DTIDX",DT,TID)) Q:TID=""  D
 . S CNT=CNT+1
 . N TTYPE,AMT
 . S TTYPE=$G(^TXNLOG(TID,"TYPE"))
 . S AMT=+$G(^TXNLOG(TID,"AMT"))
 . ;
 . I TTYPE="DEP" S TOTDEP=TOTDEP+AMT
 . I TTYPE="WDR" S TOTWDR=TOTWDR+AMT
 . I TTYPE="TRF" S TOTTRN=TOTTRN+AMT
 . ;
 . W !,TID,?10,$G(^TXNLOG(TID,"ACCTID")),?20,TTYPE,?26,$$FMTCUR^BNKUTIL(AMT)
 . W ?40,$G(^TXNLOG(TID,"TELLER")),?50,$E($G(^TXNLOG(TID,"DESC")),1,25)
 ;
 W !
 W !,"-----------------------------------------------------------------"
 W !,"Summary:"
 W !,"  Total Deposits:    ",$$FMTCUR^BNKUTIL(TOTDEP)
 W !,"  Total Withdrawals: ",$$FMTCUR^BNKUTIL(TOTWDR)
 W !,"  Total Transfers:   ",$$FMTCUR^BNKUTIL(TOTTRN)
 W !,"  Transaction Count: ",CNT
 W !,"  Net Flow:          ",$$FMTCUR^BNKUTIL(TOTDEP-TOTWDR)
 W !,"================================================================="
 ;
 D LOG^BNKAUDT(BNKUSER,"REPORT","Daily report generated for "_DT)
 Q
 ;
CUSTRPT ; Customer portfolio report
 N CID,AID,LID,TOTDEP,TOTLOAN,ATOT
 ;
 W !,"Customer ID: " R CID Q:CID=""
 S CID=+CID
 I '$D(^CUST(CID,"NAME")) W !,"Customer not found." Q
 ;
 S TOTDEP=0,TOTLOAN=0
 ;
 W !!,"================================================================="
 W !,"              CUSTOMER PORTFOLIO REPORT"
 W !,"================================================================="
 W !,"Customer: ",^CUST(CID,"NAME","FIRST")," ",^CUST(CID,"NAME","LAST")
 W !,"ID: ",CID,"  Status: ",^CUST(CID,"STATUS"),"  KYC: ",$G(^CUST(CID,"KYC"))
 W !
 ;
 ; Deposit accounts
 W !,"--- Deposit Accounts ---"
 W !,"Account",?12,"Type",?24,"Balance",?40,"Rate",?48,"Status"
 W !,"-------",?12,"----",?24,"-------",?40,"----",?48,"------"
 S AID=""
 F  S AID=$O(^ACCT("CUSTIDX",CID,AID)) Q:AID=""  D
 . S TOTDEP=TOTDEP+$G(^ACCT(AID,"BAL"))
 . W !,AID,?12,$$TYPENAME^BNKACCT(^ACCT(AID,"TYPE")),?24,$$FMTCUR^BNKUTIL(^ACCT(AID,"BAL"))
 . W ?40,$G(^ACCT(AID,"RATE")),"%",?48,$G(^ACCT(AID,"STATUS"))
 W !,"Total Deposits: ",$$FMTCUR^BNKUTIL(TOTDEP)
 ;
 ; Loans
 W !!,"--- Loans ---"
 W !,"Loan ID",?12,"Principal",?26,"Balance",?40,"Rate",?48,"Status"
 W !,"-------",?12,"---------",?26,"-------",?40,"----",?48,"------"
 S LID=""
 F  S LID=$O(^LOAN("CUSTIDX",CID,LID)) Q:LID=""  D
 . I $G(^LOAN(LID,"STATUS"))="ACTIVE" S TOTLOAN=TOTLOAN+$G(^LOAN(LID,"BALANCE"))
 . W !,LID,?12,$$FMTCUR^BNKUTIL(^LOAN(LID,"PRINCIPAL")),?26,$$FMTCUR^BNKUTIL(^LOAN(LID,"BALANCE"))
 . W ?40,$G(^LOAN(LID,"RATE")),"%",?48,$G(^LOAN(LID,"STATUS"))
 ;
 W !
 W !,"================================================================="
 W !,"Total Deposits:       ",$$FMTCUR^BNKUTIL(TOTDEP)
 W !,"Total Active Loans:   ",$$FMTCUR^BNKUTIL(TOTLOAN)
 W !,"Net Customer Value:   ",$$FMTCUR^BNKUTIL(TOTDEP-TOTLOAN)
 W !,"================================================================="
 Q
 ;
LOANRPT ; Loan portfolio summary (all loans)
 N LID,ACNT,PCNT,DCNT,ATOT,PTOT,DTOT,ORATE
 S ACNT=0,PCNT=0,DCNT=0,ATOT=0,PTOT=0,DTOT=0,ORATE=0
 ;
 W !!,"================================================================="
 W !,"              LOAN PORTFOLIO SUMMARY"
 W !,"              As of: ",$$FMTDT^BNKUTIL($$TODAY^BNKUTIL)
 W !,"================================================================="
 W !
 W !,"LoanID",?10,"Customer",?25,"Principal",?40,"Balance",?55,"Rate",?62,"Status"
 W !,"------",?10,"--------",?25,"---------",?40,"-------",?55,"----",?62,"------"
 ;
 S LID=""
 F  S LID=$O(^LOAN(LID)) Q:LID=""  D
 . Q:LID="SEQ"
 . Q:LID="CUSTIDX"
 . ;
 . N CID,STAT,BAL
 . S CID=$G(^LOAN(LID,"CUSTID"))
 . S STAT=$G(^LOAN(LID,"STATUS"))
 . S BAL=+$G(^LOAN(LID,"BALANCE"))
 . ;
 . I STAT="ACTIVE" S ACNT=ACNT+1,ATOT=ATOT+BAL,ORATE=ORATE+$G(^LOAN(LID,"RATE"))
 . I STAT="PAID" S PCNT=PCNT+1,PTOT=PTOT+$G(^LOAN(LID,"PRINCIPAL"))
 . I STAT="DEFAULT" S DCNT=DCNT+1,DTOT=DTOT+BAL
 . ;
 . W !,LID,?10,$E($G(^CUST(CID,"NAME","LAST")),1,12),?25,$$FMTCUR^BNKUTIL($G(^LOAN(LID,"PRINCIPAL")))
 . W ?40,$$FMTCUR^BNKUTIL(BAL),?55,$G(^LOAN(LID,"RATE")),"%",?62,STAT
 ;
 W !
 W !,"-----------------------------------------------------------------"
 W !,"Active Loans:    ",ACNT,"  Outstanding: ",$$FMTCUR^BNKUTIL(ATOT)
 I ACNT>0 W !,"Avg Rate:        ",$J(ORATE/ACNT,0,2),"%"
 W !,"Paid Off:        ",PCNT,"  Total Originated: ",$$FMTCUR^BNKUTIL(PTOT)
 W !,"Defaulted:       ",DCNT,"  At Risk: ",$$FMTCUR^BNKUTIL(DTOT)
 W !,"================================================================="
 Q
 ;
TYPESUMM ; Summary by account type
 N AID,TYPE,TCNT,TBAL
 ;
 ; Initialize counters
 N SAV,CHK,FD
 S SAV=0,CHK=0,FD=0
 N SAVB,CHKB,FDB
 S SAVB=0,CHKB=0,FDB=0
 ;
 S AID=""
 F  S AID=$O(^ACCT(AID)) Q:AID=""  D
 . Q:AID="SEQ"
 . Q:AID="CUSTIDX"
 . Q:$G(^ACCT(AID,"STATUS"))'="ACTIVE"
 . ;
 . S TYPE=$G(^ACCT(AID,"TYPE"))
 . I TYPE="SAV" S SAV=SAV+1,SAVB=SAVB+$G(^ACCT(AID,"BAL"))
 . I TYPE="CHK" S CHK=CHK+1,CHKB=CHKB+$G(^ACCT(AID,"BAL"))
 . I TYPE="FD" S FD=FD+1,FDB=FDB+$G(^ACCT(AID,"BAL"))
 ;
 N TOTAL S TOTAL=SAVB+CHKB+FDB
 ;
 W !!,"================================================================="
 W !,"              DEPOSIT PORTFOLIO BY TYPE"
 W !,"================================================================="
 W !
 W !,"Type",?18,"Count",?28,"Total Balance",?48,"Avg Balance"
 W !,"----",?18,"-----",?28,"-------------",?48,"-----------"
 W !,"Savings",?18,SAV,?28,$$FMTCUR^BNKUTIL(SAVB),?48,$S(SAV>0:$$FMTCUR^BNKUTIL(SAVB/SAV),1:"N/A")
 W !,"Checking",?18,CHK,?28,$$FMTCUR^BNKUTIL(CHKB),?48,$S(CHK>0:$$FMTCUR^BNKUTIL(CHKB/CHK),1:"N/A")
 W !,"Fixed Dep",?18,FD,?28,$$FMTCUR^BNKUTIL(FDB),?48,$S(FD>0:$$FMTCUR^BNKUTIL(FDB/FD),1:"N/A")
 W !
 W !,"Grand Total:  ",(SAV+CHK+FD)," accounts,  ",$$FMTCUR^BNKUTIL(TOTAL)
 W !,"================================================================="
 Q
