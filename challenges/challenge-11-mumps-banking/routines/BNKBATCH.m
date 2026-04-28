BNKBATCH ; End-of-Day Batch Processing
 ; Runs interest accrual, fee charges, loan checks, FD maturity
 ; Should be run once daily after business hours
 ;
RUN ; Main batch entry point
 N RUNID,STARTDT,ENDDT,ERRCNT
 ;
 ; Check if batch already ran today
 I $G(^BATCH("LASTRUN"))=$$TODAY^BNKUTIL D  Q
 . W !,"Batch already ran today (",$$FMTDT^BNKUTIL($$TODAY^BNKUTIL),")."
 . W !,"Cannot run twice in same day."
 ;
 W !!,"=== END-OF-DAY BATCH PROCESSING ==="
 W !,"Date: ",$$FMTDT^BNKUTIL($$TODAY^BNKUTIL)
 W !,"Starting..."
 ;
 S STARTDT=$$NOW^BNKUTIL
 S ERRCNT=0
 ;
 ; Generate batch run ID
 L +^BATCH("SEQ"):5
 I '$T W !,"Cannot acquire batch lock." Q
 S RUNID=$G(^BATCH("SEQ"),0)+1
 S ^BATCH("SEQ")=RUNID
 L -^BATCH("SEQ")
 ;
 S ^BATCH(RUNID,"START")=STARTDT
 S ^BATCH(RUNID,"STATUS")="RUNNING"
 ;
 ; Step 1: Interest calculation
 W !,"  [1/4] Calculating savings interest..."
 N SAVINT S SAVINT=$$CALCSAV^BNKINTR
 S ^BATCH(RUNID,"SAVINT")=SAVINT
 W " $",SAVINT," posted"
 ;
 W !,"  [2/4] Calculating checking interest..."
 N CHKINT S CHKINT=$$CALCCHK^BNKINTR
 S ^BATCH(RUNID,"CHKINT")=CHKINT
 W " $",CHKINT," posted"
 ;
 ; Step 2: Check for matured FDs
 W !,"  [3/4] Processing Fixed Deposit maturities..."
 N FDMAT S FDMAT=$$CALCFD^BNKINTR
 S ^BATCH(RUNID,"FDMAT")=FDMAT
 W " ",FDMAT," FD(s) matured"
 ;
 ; Step 3: Low balance fees for checking accounts
 W !,"  [4/4] Processing maintenance fees..."
 N FEES S FEES=$$CHRGMAINT
 S ^BATCH(RUNID,"FEES")=FEES
 W " $",FEES," in fees charged"
 ;
 ; Step 4: Check for overdue loan payments
 D CHKLNDUE(RUNID)
 ;
 ; Finalize
 S ENDDT=$$NOW^BNKUTIL
 S ^BATCH(RUNID,"END")=ENDDT
 S ^BATCH(RUNID,"ERRORS")=ERRCNT
 S ^BATCH(RUNID,"STATUS")="COMPLETE"
 S ^BATCH("LASTRUN")=$$TODAY^BNKUTIL
 ;
 W !!,"Batch complete."
 W !,"Run ID:     ",RUNID
 W !,"Started:    ",STARTDT
 W !,"Finished:   ",ENDDT
 W !,"Errors:     ",ERRCNT
 ;
 D LOG^BNKAUDT("SYSTEM","BATCH","EOD batch "_RUNID_" completed. Errors: "_ERRCNT)
 Q
 ;
CHRGMAINT() ; Charge monthly maintenance fee for low-balance checking
 ; Fee: $12/month if checking balance < $500
 ; Only charges on the 1st of the month
 ;
 N DAY S DAY=+$E($$TODAY^BNKUTIL,7,8)
 I DAY'=1 Q 0  ; only charge on 1st
 ;
 N AID,TOTAL,FEE
 S TOTAL=0
 S FEE=12  ; hardcoded - should read from ^BNKCONF (noted 2017)
 ;
 S AID=""
 F  S AID=$O(^ACCT(AID)) Q:AID=""  D
 . Q:AID="SEQ"
 . Q:AID="CUSTIDX"
 . Q:$G(^ACCT(AID,"TYPE"))'="CHK"
 . Q:$G(^ACCT(AID,"STATUS"))'="ACTIVE"
 . ;
 . I +$G(^ACCT(AID,"BAL"))<500 D
 . . D CHRGFEE^BNKTXN(AID,FEE,"Monthly maintenance fee")
 . . S TOTAL=TOTAL+FEE
 ;
 Q TOTAL
 ;
CHKLNDUE(RUNID) ; Check for overdue loan payments
 N LID,TODAY,NXTPMT,OVERDUE
 S TODAY=$$TODAY^BNKUTIL
 S OVERDUE=0
 ;
 S LID=""
 F  S LID=$O(^LOAN(LID)) Q:LID=""  D
 . Q:LID="SEQ"
 . Q:LID="CUSTIDX"
 . Q:$G(^LOAN(LID,"STATUS"))'="ACTIVE"
 . ;
 . S NXTPMT=$G(^LOAN(LID,"NEXTPMT"))
 . Q:NXTPMT=""
 . ;
 . ; Check if payment is overdue (more than 30 days past due)
 . N DAYS S DAYS=$$DAYSDIFF^BNKUTIL(NXTPMT,TODAY)
 . I DAYS>30 D
 . . S OVERDUE=OVERDUE+1
 . . ; Mark as delinquent after 90 days
 . . I DAYS>90,$G(^LOAN(LID,"STATUS"))="ACTIVE" D
 . . . S ^LOAN(LID,"STATUS")="DEFAULT"
 . . . D LOG^BNKAUDT("SYSTEM","LNDEFAULT","Loan "_LID_" defaulted after "_DAYS_" days overdue")
 . . . W !,"  WARNING: Loan ",LID," marked as DEFAULT"
 . . E  D
 . . . ; Send reminder (just log it)
 . . . D LOG^BNKAUDT("SYSTEM","LNOVERDUE","Loan "_LID_" is "_DAYS_" days overdue")
 ;
 S ^BATCH(RUNID,"OVERDUE")=OVERDUE
 I OVERDUE>0 W !,"  Overdue loans: ",OVERDUE
 Q
 ;
STATUS ; Show batch processing status/history
 N RID,CNT
 ;
 W !!,"=== Batch Processing History ==="
 W !,"Last Run: ",$G(^BATCH("LASTRUN"),"Never")
 W !
 W !,"RunID",?8,"Date",?22,"Status",?32,"Interest",?48,"Fees",?60,"Errors"
 W !,"-----",?8,"----",?22,"------",?32,"--------",?48,"----",?60,"------"
 ;
 S RID="",CNT=0
 F  S RID=$O(^BATCH(RID),-1) Q:RID=""  Q:CNT>=20  D
 . Q:RID="SEQ"
 . Q:RID="LASTRUN"
 . Q:RID="STATUS"
 . S CNT=CNT+1
 . N TOTINT S TOTINT=+$G(^BATCH(RID,"SAVINT"))+$G(^BATCH(RID,"CHKINT"))
 . W !,RID,?8,$P($G(^BATCH(RID,"START"))," ",1),?22,$G(^BATCH(RID,"STATUS"))
 . W ?32,"$",TOTINT,?48,"$",$G(^BATCH(RID,"FEES"),0),?60,$G(^BATCH(RID,"ERRORS"),0)
 ;
 I CNT=0 W !,"No batch history."
 Q
