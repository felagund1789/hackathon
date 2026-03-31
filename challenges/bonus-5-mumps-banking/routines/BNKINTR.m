BNKINTR ; Interest Calculation Module
 ; Calculates and applies interest for savings, checking, and FD accounts
 ; Called by BNKBATCH during end-of-day processing
 ;
CALCSAV() ; Calculate daily interest for savings accounts
 ; Uses actual/365 day count convention
 ; Interest accrues daily, posts monthly on last business day
 ;
 N AID,BAL,RATE,DAILY,ACCR,DIM
 S AID=""
 N TOTAL S TOTAL=0
 ;
 F  S AID=$O(^ACCT(AID)) Q:AID=""  D
 . Q:AID="SEQ"
 . Q:AID="CUSTIDX"
 . Q:$G(^ACCT(AID,"TYPE"))'="SAV"
 . Q:$G(^ACCT(AID,"STATUS"))'="ACTIVE"
 . ;
 . S BAL=+$G(^ACCT(AID,"BAL"))
 . Q:BAL<=0
 . S RATE=+$G(^ACCT(AID,"RATE"))
 . Q:RATE<=0
 . ;
 . ; Daily interest = balance * (annual rate / 365)
 . S DAILY=BAL*(RATE/100/365)
 . S DAILY=$J(DAILY,0,4)   ; keep 4 decimals for accrual
 . ;
 . ; Accumulate in accrual bucket
 . S ACCR=+$G(^ACCT(AID,"ACCRINT"))
 . S ^ACCT(AID,"ACCRINT")=ACCR+DAILY
 . ;
 . ; Post interest on month end (day 28+ as approximation)
 . ; NOTE: this is an intentional simplification - real systems
 . ; use actual calendar month-end dates
 . S DIM=+$E($$TODAY^BNKUTIL,7,8)
 . I DIM>=28 D
 . . N POSTAMT S POSTAMT=+$G(^ACCT(AID,"ACCRINT"))
 . . I POSTAMT>0.01 D
 . . . S POSTAMT=$J(POSTAMT,0,2)
 . . . D CREDIT^BNKTXN(AID,POSTAMT,"Monthly interest credit")
 . . . S ^ACCT(AID,"ACCRINT")=0
 . . . S ^ACCT(AID,"LASTINT")=$$NOW^BNKUTIL
 . . . S TOTAL=TOTAL+POSTAMT
 ;
 Q TOTAL
 ;
CALCCHK() ; Calculate daily interest for checking accounts
 ; Same structure as savings but typically lower rate
 N AID,BAL,RATE,DAILY,ACCR,DIM
 S AID=""
 N TOTAL S TOTAL=0
 ;
 F  S AID=$O(^ACCT(AID)) Q:AID=""  D
 . Q:AID="SEQ"
 . Q:AID="CUSTIDX"
 . Q:$G(^ACCT(AID,"TYPE"))'="CHK"
 . Q:$G(^ACCT(AID,"STATUS"))'="ACTIVE"
 . ;
 . S BAL=+$G(^ACCT(AID,"BAL"))
 . ; Checking accounts earn interest only above $1000
 . Q:BAL<1000
 . S RATE=+$G(^ACCT(AID,"RATE"))
 . Q:RATE<=0
 . ;
 . S DAILY=BAL*(RATE/100/365)
 . S DAILY=$J(DAILY,0,4)
 . S ACCR=+$G(^ACCT(AID,"ACCRINT"))
 . S ^ACCT(AID,"ACCRINT")=ACCR+DAILY
 . ;
 . S DIM=+$E($$TODAY^BNKUTIL,7,8)
 . I DIM>=28 D
 . . N POSTAMT S POSTAMT=+$G(^ACCT(AID,"ACCRINT"))
 . . I POSTAMT>0.01 D
 . . . S POSTAMT=$J(POSTAMT,0,2)
 . . . D CREDIT^BNKTXN(AID,POSTAMT,"Monthly interest credit")
 . . . S ^ACCT(AID,"ACCRINT")=0
 . . . S TOTAL=TOTAL+POSTAMT
 ;
 Q TOTAL
 ;
CALCFD() ; Calculate interest for fixed deposits
 ; FD interest is calculated at maturity, not daily
 ; This routine checks for matured FDs and processes them
 ;
 N AID,TODAY
 S AID=""
 S TODAY=$$TODAY^BNKUTIL
 N MATCNT S MATCNT=0
 ;
 F  S AID=$O(^ACCT(AID)) Q:AID=""  D
 . Q:AID="SEQ"
 . Q:AID="CUSTIDX"
 . Q:$G(^ACCT(AID,"TYPE"))'="FD"
 . Q:$G(^ACCT(AID,"STATUS"))'="ACTIVE"
 . ;
 . N MAT S MAT=$G(^ACCT(AID,"MATURITY"))
 . Q:MAT=""
 . ;
 . ; Check if FD has matured
 . I MAT'>TODAY D
 . . ; Calculate total interest for FD
 . . N ORIG,RATE,TERM,INTEREST
 . . S ORIG=+$G(^ACCT(AID,"ORIGDEP"))
 . . S RATE=+$G(^ACCT(AID,"RATE"))
 . . S TERM=+$G(^ACCT(AID,"TERM"))
 . . ;
 . . ; Simple interest for FD: P * R * T / 12
 . . ; (compound interest was proposed in 2016 but never implemented)
 . . S INTEREST=ORIG*(RATE/100)*(TERM/12)
 . . S INTEREST=$J(INTEREST,0,2)
 . . ;
 . . D CREDIT^BNKTXN(AID,INTEREST,"FD maturity interest credit")
 . . S ^ACCT(AID,"STATUS")="MATURED"
 . . S ^ACCT(AID,"MATUREDDT")=$$NOW^BNKUTIL
 . . S MATCNT=MATCNT+1
 . . ;
 . . D LOG^BNKAUDT("SYSTEM","FDMAT","FD "_AID_" matured. Interest: $"_INTEREST)
 ;
 Q MATCNT
 ;
PROJINT(AID,MONTHS) ; Project interest earnings for an account
 ; Utility function for customer reports - not used in batch
 I '$D(^ACCT(AID,"TYPE")) Q -1
 ;
 N BAL,RATE,TYPE,PROJ
 S BAL=+$G(^ACCT(AID,"BAL"))
 S RATE=+$G(^ACCT(AID,"RATE"))
 S TYPE=$G(^ACCT(AID,"TYPE"))
 ;
 I TYPE="FD" D  Q PROJ
 . S PROJ=BAL*(RATE/100)*(MONTHS/12)
 . S PROJ=$J(PROJ,0,2)
 ;
 ; For SAV/CHK - compound monthly (approximate)
 N I,MONTHLY S PROJ=0
 F I=1:1:MONTHS D
 . S MONTHLY=BAL*(RATE/100/12)
 . S PROJ=PROJ+MONTHLY
 . S BAL=BAL+MONTHLY
 S PROJ=$J(PROJ,0,2)
 Q PROJ
