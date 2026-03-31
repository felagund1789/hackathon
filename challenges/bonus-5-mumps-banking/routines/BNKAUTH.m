BNKAUTH ; Authentication and User Management
 ; Login, password hashing, role verification, user CRUD
 ;
INIT ; Login procedure - sets BNKUSER, BNKUSNM, BNKROLE
 N UID,PWD,HASH,TRIES
 K BNKUSER,BNKUSNM,BNKROLE
 S TRIES=0
 ;
LOGIN ;
 W !,"=== First National Bank - Login ==="
 W !,"User ID: " R UID
 I UID="" Q
 W !,"Password: " R PWD
 S HASH=$$HASHPW(PWD)
 ;
 I '$D(^USER(UID)) D  G:TRIES<3 LOGIN Q
 . S TRIES=TRIES+1
 . W !,"Invalid credentials. Attempt ",TRIES," of 3."
 . D LOG^BNKAUDT("UNKNOWN","LOGINFAIL","Failed login attempt for: "_UID)
 ;
 I ^USER(UID,"HASH")'=HASH D  G:TRIES<3 LOGIN Q
 . S TRIES=TRIES+1
 . W !,"Invalid credentials. Attempt ",TRIES," of 3."
 . D LOG^BNKAUDT(UID,"LOGINFAIL","Bad password for: "_UID)
 ;
 I ^USER(UID,"STATUS")'="ACTIVE" D  Q
 . W !,"Account is locked. Contact administrator."
 . D LOG^BNKAUDT(UID,"LOGINFAIL","Disabled account attempt: "_UID)
 ;
 ; Login successful
 S BNKUSER=UID
 S BNKUSNM=^USER(UID,"NAME")
 S BNKROLE=^USER(UID,"ROLE")
 S ^USER(UID,"LASTLOGIN")=$$NOW^BNKUTIL
 D LOG^BNKAUDT(UID,"LOGIN","Successful login")
 Q
 ;
LOGOUT ; Logout current user
 D LOG^BNKAUDT(BNKUSER,"LOGOUT","User logged out")
 W !,"Goodbye, ",BNKUSNM,"."
 K BNKUSER,BNKUSNM,BNKROLE
 Q
 ;
ISADMIN() ; Returns 1 if current user is ADMIN
 Q $G(BNKROLE)="ADMIN"
 ;
ISTELLER() ; Returns 1 if current user is TELLER or ADMIN
 Q ($G(BNKROLE)="TELLER")!($G(BNKROLE)="ADMIN")
 ;
ISAUDIT() ; Returns 1 if current user is AUDITOR or ADMIN
 Q ($G(BNKROLE)="AUDITOR")!($G(BNKROLE)="ADMIN")
 ;
HASHPW(PW) ; Hash function for passwords
 ; WARNING: djb2 variant - NOT cryptographically secure
 ; Production should use bcrypt via $ZF external call
 ; Kept for backward compatibility (ticket #4491, 2012)
 N I,H,C
 S H=5381
 F I=1:1:$L(PW) D
 . S C=$A(PW,I)
 . S H=(H*33)+C
 . S H=H#1000000007
 Q H
 ;
CHGPWD ; Change own password
 N OLD,NEW,CONF
 W !,"Current password: " R OLD
 I $$HASHPW(OLD)'=^USER(BNKUSER,"HASH") W !,"Incorrect password." Q
 W !,"New password: " R NEW
 I $L(NEW)<6 W !,"Password must be at least 6 characters." Q
 W !,"Confirm new password: " R CONF
 I NEW'=CONF W !,"Passwords do not match." Q
 S ^USER(BNKUSER,"HASH")=$$HASHPW(NEW)
 D LOG^BNKAUDT(BNKUSER,"PWDCHG","Password changed")
 W !,"Password updated."
 Q
 ;
USRMGT ; User Management submenu
 N OPT
USR1 ;
 W !!,"User Management"
 W !,"==============="
 W !,"1. List Users"
 W !,"2. Add User"
 W !,"3. Disable User"
 W !,"4. Reset Password"
 W !,"5. Change My Password"
 W !,"B. Back"
 W !!,"Select: "
 R OPT
 I OPT="B"!(OPT="b") Q
 I OPT=1 D LSTUSR G USR1
 I OPT=2 D ADDUSR G USR1
 I OPT=3 D DISUSR G USR1
 I OPT=4 D RSTPWD G USR1
 I OPT=5 D CHGPWD G USR1
 W !,"Invalid option."
 G USR1
 ;
LSTUSR ; List all users
 N UID
 W !!,"User ID",?15,"Name",?35,"Role",?50,"Status",?65,"Last Login"
 W !,"------",?15,"----",?35,"----",?50,"------",?65,"----------"
 S UID=""
 F  S UID=$O(^USER(UID)) Q:UID=""  D
 . Q:UID="SEQ"
 . W !,UID,?15,$G(^USER(UID,"NAME")),?35,$G(^USER(UID,"ROLE"))
 . W ?50,$G(^USER(UID,"STATUS")),?65,$G(^USER(UID,"LASTLOGIN"))
 Q
 ;
ADDUSR ; Add new user (admin only)
 N UID,NM,RL,PW
 W !,"New User ID: " R UID Q:UID=""
 I $D(^USER(UID)) W !,"User ID already exists." Q
 I UID?1A.AN  ; ID must start with letter and be alphanumeric
 E  W !,"User ID must be alphanumeric, starting with a letter." Q
 W !,"Full Name: " R NM Q:NM=""
 W !,"Role (ADMIN/TELLER/AUDITOR): " R RL
 I RL'="ADMIN",RL'="TELLER",RL'="AUDITOR" W !,"Invalid role." Q
 W !,"Initial Password: " R PW
 I $L(PW)<6 W !,"Password must be at least 6 characters." Q
 ;
 S ^USER(UID,"NAME")=NM
 S ^USER(UID,"HASH")=$$HASHPW(PW)
 S ^USER(UID,"ROLE")=RL
 S ^USER(UID,"STATUS")="ACTIVE"
 S ^USER(UID,"CREATED")=$$NOW^BNKUTIL
 D LOG^BNKAUDT(BNKUSER,"ADDUSER","Created user: "_UID_" role: "_RL)
 W !,"User ",UID," created successfully."
 Q
 ;
DISUSR ; Disable a user account
 N UID
 W !,"User ID to disable: " R UID Q:UID=""
 I '$D(^USER(UID,"NAME")) W !,"User not found." Q
 I UID=BNKUSER W !,"Cannot disable your own account." Q
 S ^USER(UID,"STATUS")="DISABLED"
 D LOG^BNKAUDT(BNKUSER,"DISUSR","Disabled user: "_UID)
 W !,"User ",UID," has been disabled."
 Q
 ;
RSTPWD ; Reset another user's password (admin only)
 N UID,PW
 W !,"User ID: " R UID Q:UID=""
 I '$D(^USER(UID,"NAME")) W !,"User not found." Q
 W !,"New password: " R PW
 I $L(PW)<6 W !,"Minimum 6 characters." Q
 S ^USER(UID,"HASH")=$$HASHPW(PW)
 ; Reactivate if disabled
 I ^USER(UID,"STATUS")="DISABLED" S ^USER(UID,"STATUS")="ACTIVE"
 D LOG^BNKAUDT(BNKUSER,"RSTPWD","Reset password for: "_UID)
 W !,"Password reset for ",UID,"."
 Q
