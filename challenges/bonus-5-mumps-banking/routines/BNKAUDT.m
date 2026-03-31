BNKAUDT ; Audit Trail Module
 ; All security-relevant and business actions are logged here
 ;
LOG(USER,ACTION,DETAIL) ; Write an audit log entry
 N AID
 L +^AUDIT("SEQ"):5
 I '$T Q  ; silently fail if can't lock - audit should not block operations
 S AID=$G(^AUDIT("SEQ"),0)+1
 S ^AUDIT("SEQ")=AID
 L -^AUDIT("SEQ")
 ;
 S ^AUDIT(AID,"USER")=$G(USER,"UNKNOWN")
 S ^AUDIT(AID,"ACTION")=ACTION
 S ^AUDIT(AID,"DETAIL")=$E(DETAIL,1,200)  ; truncate long details
 S ^AUDIT(AID,"DT")=$$NOW^BNKUTIL
 ;
 ; Date index for efficient querying
 N DT S DT=$P($$NOW^BNKUTIL," ",1)
 S ^AUDIT("DTIDX",DT,AID)=""
 Q
 ;
VIEWLOG ; View audit log entries
 N OPT
 W !!,"Audit Log Viewer"
 W !,"================"
 W !,"1. View recent entries"
 W !,"2. View by date"
 W !,"3. View by user"
 W !,"4. View by action type"
 W !,"B. Back"
 W !!,"Select: " R OPT
 I OPT="B"!(OPT="b") Q
 I OPT=1 D RECENT Q
 I OPT=2 D BYDATE Q
 I OPT=3 D BYUSER Q
 I OPT=4 D BYACTION Q
 W !,"Invalid option."
 Q
 ;
RECENT ; Show last N audit entries
 N MAXR,AID,CNT
 W !,"How many entries? (default 25): " R MAXR
 S:MAXR="" MAXR=25
 S MAXR=+MAXR
 I MAXR<1 S MAXR=25
 I MAXR>500 S MAXR=500
 ;
 D HEADER
 S AID="",CNT=0
 F  S AID=$O(^AUDIT(AID),-1) Q:AID=""  Q:CNT>=MAXR  D
 . Q:AID="SEQ"
 . Q:AID="DTIDX"
 . S CNT=CNT+1
 . D DISPENTRY(AID)
 ;
 I CNT=0 W !,"No audit entries found."
 Q
 ;
BYDATE ; Show entries for a specific date
 N DT,AID,CNT
 W !,"Date (YYYYMMDD, blank for today): " R DT
 S:DT="" DT=$$TODAY^BNKUTIL
 ;
 D HEADER
 S AID="",CNT=0
 F  S AID=$O(^AUDIT("DTIDX",DT,AID)) Q:AID=""  D
 . S CNT=CNT+1
 . D DISPENTRY(AID)
 ;
 W !,"Total entries for ",$$FMTDT^BNKUTIL(DT),": ",CNT
 Q
 ;
BYUSER ; Filter by user ID
 N USER,AID,CNT,MAXR
 W !,"User ID: " R USER Q:USER=""
 S MAXR=100
 ;
 D HEADER
 S AID="",CNT=0
 F  S AID=$O(^AUDIT(AID),-1) Q:AID=""  Q:CNT>=MAXR  D
 . Q:AID="SEQ"
 . Q:AID="DTIDX"
 . Q:$G(^AUDIT(AID,"USER"))'=USER
 . S CNT=CNT+1
 . D DISPENTRY(AID)
 ;
 W !,"Total entries for user ",USER,": ",CNT
 Q
 ;
BYACTION ; Filter by action type
 N ACT,AID,CNT,MAXR
 W !,"Action type (LOGIN/LOGOUT/NEWCUST/NEWACCT/TRANSFER/etc.): " R ACT Q:ACT=""
 S MAXR=100
 ;
 D HEADER
 S AID="",CNT=0
 F  S AID=$O(^AUDIT(AID),-1) Q:AID=""  Q:CNT>=MAXR  D
 . Q:AID="SEQ"
 . Q:AID="DTIDX"
 . Q:$G(^AUDIT(AID,"ACTION"))'=ACT
 . S CNT=CNT+1
 . D DISPENTRY(AID)
 ;
 W !,"Total entries for action ",ACT,": ",CNT
 Q
 ;
HEADER ; Print log header
 W !
 W !,"ID",?8,"Date/Time",?28,"User",?40,"Action",?55,"Detail"
 W !,"--",?8,"---------",?28,"----",?40,"------",?55,"------"
 Q
 ;
DISPENTRY(AID) ; Display a single audit entry
 W !,AID,?8,$G(^AUDIT(AID,"DT")),?28,$G(^AUDIT(AID,"USER")),?40,$G(^AUDIT(AID,"ACTION"))
 W ?55,$E($G(^AUDIT(AID,"DETAIL")),1,40)
 Q
