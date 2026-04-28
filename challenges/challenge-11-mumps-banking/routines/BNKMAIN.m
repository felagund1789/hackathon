BNKMAIN ; First National Bank - Core Banking System v3.2.1
 ; Main Menu and System Entry Point
 ; Original author: R.K. Sharma, 1997
 ; Last modified: J. Patterson, Nov 2019
 ;
 N OPT
 D INIT^BNKAUTH
 I '$D(BNKUSER) W !,"Authentication failed.",! Q
 W #
 W !,"============================================="
 W !,"  FIRST NATIONAL BANK - CORE BANKING SYSTEM"
 W !,"============================================="
 W !,"Welcome, ",BNKUSNM," (",BNKROLE,")"
 W !,"Session started: ",$$NOW^BNKUTIL
 ;
MENU ;
 W !!,"Main Menu"
 W !,"========="
 W !,"1. Customer Management"
 W !,"2. Account Management"
 W !,"3. Transactions"
 W !,"4. Loan Management"
 W !,"5. Reports"
 W !,"6. End-of-Day Processing"
 W !,"7. System Administration"
 W !,"Q. Logout"
 W !!,"Select option: "
 R OPT
 I OPT="Q"!(OPT="q") D LOGOUT^BNKAUTH Q
 I OPT=1 D MENU^BNKCUST G MENU
 I OPT=2 D MENU^BNKACCT G MENU
 I OPT=3 D:'$$ISTELLER^BNKAUTH NOPERM D:$$ISTELLER^BNKAUTH MENU^BNKTXN G MENU
 I OPT=4 D MENU^BNKLOAN G MENU
 I OPT=5 D MENU^BNKRPT G MENU
 I OPT=6 D:'$$ISADMIN^BNKAUTH NOPERM D:$$ISADMIN^BNKAUTH RUN^BNKBATCH G MENU
 I OPT=7 D:'$$ISADMIN^BNKAUTH NOPERM D:$$ISADMIN^BNKAUTH ADMIN G MENU
 W !,"Invalid option."
 G MENU
 ;
ADMIN ; System Administration Submenu
 N OPT
ADM1 ;
 W !!,"System Administration"
 W !,"===================="
 W !,"1. User Management"
 W !,"2. System Configuration"
 W !,"3. View Audit Log"
 W !,"4. Initialize System (WARNING: Resets all data)"
 W !,"B. Back"
 W !!,"Select: "
 R OPT
 I OPT="B"!(OPT="b") Q
 I OPT=1 D USRMGT^BNKAUTH G ADM1
 I OPT=2 D CONFIG G ADM1
 I OPT=3 D VIEWLOG^BNKAUDT G ADM1
 I OPT=4 D CONFIRM G ADM1
 W !,"Invalid option."
 G ADM1
 ;
CONFIG ; View and edit system configuration
 N KEY,VAL,SUB
 W !!,"=== System Configuration ==="
 S SUB=""
 F  S SUB=$O(^BNKCONF(SUB)) Q:SUB=""  D
 . N SUB2 S SUB2=""
 . F  S SUB2=$O(^BNKCONF(SUB,SUB2)) Q:SUB2=""  D
 . . W !,"  ",SUB,".",SUB2," = ",^BNKCONF(SUB,SUB2)
 W !!,"Edit a setting? (Y/N): "
 N ANS R ANS
 Q:ANS'="Y"&(ANS'="y")
 W !,"Enter key (e.g., RATES.SAVINGS): "
 N KEYSTR R KEYSTR
 S KEY=$P(KEYSTR,".",1),SUB=$P(KEYSTR,".",2)
 I KEY=""!(SUB="") W !,"Invalid key format." Q
 I '$D(^BNKCONF(KEY,SUB)) W !,"Key not found." Q
 W !,"Current value: ",^BNKCONF(KEY,SUB)
 W !,"New value: "
 R VAL
 I VAL="" W !,"No change." Q
 N OLD S OLD=^BNKCONF(KEY,SUB)
 S ^BNKCONF(KEY,SUB)=VAL
 D LOG^BNKAUDT(BNKUSER,"CONFIG","Changed "_KEYSTR_" from "_OLD_" to "_VAL)
 W !,"Updated."
 Q
 ;
CONFIRM ; Confirm full system reset
 N ANS
 W !!,"*** WARNING: This will ERASE ALL customer, account,"
 W !,"    transaction, and loan data. ***"
 W !,"Type RESET to confirm: "
 R ANS
 I ANS="RESET" D INIT^BNKINIT W !,"System reinitialized." Q
 W !,"Reset cancelled."
 Q
 ;
NOPERM ; Insufficient permissions
 W !,"Access denied. Insufficient privileges for this operation."
 D LOG^BNKAUDT($G(BNKUSER,"UNKNOWN"),"SECURITY","Unauthorized access attempt")
 Q
