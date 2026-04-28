BNKCUST ; Customer Management Module
 ; CRUD operations, search, and customer-account summary
 ;
MENU ; Customer Management Menu
 N OPT
CM1 ;
 W !!,"Customer Management"
 W !,"==================="
 W !,"1. Register New Customer"
 W !,"2. Search Customer"
 W !,"3. View Customer Details"
 W !,"4. Update Customer"
 W !,"5. Customer Account Summary"
 W !,"B. Back"
 W !!,"Select: "
 R OPT
 I OPT="B"!(OPT="b") Q
 I OPT=1 D REGISTER G CM1
 I OPT=2 D SEARCH G CM1
 I OPT=3 D VIEWCUST G CM1
 I OPT=4 D UPDCUST G CM1
 I OPT=5 D ACCTSUM G CM1
 W !,"Invalid option."
 G CM1
 ;
REGISTER ; Register a new customer
 N FN,LN,DOB,SSN,AD1,AD2,CTY,ST,ZIP,PH,EM,CID
 ;
 W !!,"=== New Customer Registration ==="
 W !,"First Name: " R FN Q:FN=""
 W !,"Last Name: " R LN Q:LN=""
 W !,"Date of Birth (YYYYMMDD): " R DOB
 I '$$VALDATE^BNKUTIL(DOB) W !,"Invalid date." Q
 I '$$ISADULT(DOB) W !,"Customer must be 18 or older." Q
 W !,"SSN (XXX-XX-XXXX): " R SSN
 I '$$VALSSN(SSN) W !,"Invalid SSN format." Q
 ;
 ; Duplicate SSN check
 I $D(^CUST("IDX","SSN",SSN)) D  Q
 . W !,"A customer with this SSN already exists."
 . W !,"Existing Customer ID: ",^CUST("IDX","SSN",SSN)
 ;
 W !,"Address Line 1: " R AD1 Q:AD1=""
 W !,"Address Line 2 (optional): " R AD2
 W !,"City: " R CTY Q:CTY=""
 W !,"State (2-letter): " R ST
 I $L(ST)'=2 W !,"Invalid state code." Q
 S ST=$$UPPER^BNKUTIL(ST)
 W !,"ZIP Code: " R ZIP
 I '$$VALZIP(ZIP) W !,"Invalid ZIP code." Q
 W !,"Phone: " R PH
 W !,"Email: " R EM
 ;
 ; Sequence generation with LOCK for concurrency
 L +^CUST("SEQ"):5
 I '$T W !,"System busy, please try again." Q
 S CID=$G(^CUST("SEQ"),10000)+1
 S ^CUST("SEQ")=CID
 L -^CUST("SEQ")
 ;
 ; Store customer record
 S ^CUST(CID,"NAME","FIRST")=$$UPPER^BNKUTIL(FN)
 S ^CUST(CID,"NAME","LAST")=$$UPPER^BNKUTIL(LN)
 S ^CUST(CID,"DOB")=DOB
 S ^CUST(CID,"SSN")=SSN
 S ^CUST(CID,"ADDR","LINE1")=AD1
 S ^CUST(CID,"ADDR","LINE2")=AD2
 S ^CUST(CID,"ADDR","CITY")=CTY
 S ^CUST(CID,"ADDR","STATE")=ST
 S ^CUST(CID,"ADDR","ZIP")=ZIP
 S ^CUST(CID,"PHONE")=PH
 S ^CUST(CID,"EMAIL")=EM
 S ^CUST(CID,"STATUS")="ACTIVE"
 S ^CUST(CID,"CREATED")=$$NOW^BNKUTIL
 S ^CUST(CID,"KYC")="PENDING"
 ;
 ; Build indexes
 S ^CUST("IDX","SSN",SSN)=CID
 S ^CUST("IDX","NAME",$$UPPER^BNKUTIL(LN),$$UPPER^BNKUTIL(FN),CID)=""
 ;
 D LOG^BNKAUDT(BNKUSER,"NEWCUST","Registered customer "_CID_": "_FN_" "_LN)
 ;
 W !!,"Customer registered successfully."
 W !,"Customer ID: ",CID
 Q
 ;
SEARCH ; Search for a customer
 N STYPE,SVAL
 W !!,"Search by:"
 W !,"1. SSN"
 W !,"2. Last Name"
 W !,"3. Customer ID"
 W !,"Select: "
 R STYPE
 ;
 I STYPE=1 D  Q
 . W !,"Enter SSN: " R SVAL Q:SVAL=""
 . I '$D(^CUST("IDX","SSN",SVAL)) W !,"No customer found." Q
 . D DISPCUST(^CUST("IDX","SSN",SVAL))
 ;
 I STYPE=2 D  Q
 . N LN,FN,CID,CNT
 . W !,"Last Name: " R LN Q:LN=""
 . S LN=$$UPPER^BNKUTIL(LN)
 . S FN="",CNT=0
 . W !
 . W !,"ID",?10,"Name",?40,"SSN",?55,"Status"
 . W !,"--",?10,"----",?40,"---",?55,"------"
 . F  S FN=$O(^CUST("IDX","NAME",LN,FN)) Q:FN=""  D
 . . S CID=""
 . . F  S CID=$O(^CUST("IDX","NAME",LN,FN,CID)) Q:CID=""  D
 . . . S CNT=CNT+1
 . . . W !,CID,?10,FN_" "_LN,?40,$$MASKSSN($G(^CUST(CID,"SSN"))),?55,$G(^CUST(CID,"STATUS"))
 . I CNT=0 W !,"No customers found with that name."
 ;
 I STYPE=3 D  Q
 . W !,"Customer ID: " R SVAL Q:SVAL=""
 . I '$D(^CUST(+SVAL,"NAME")) W !,"Customer not found." Q
 . D DISPCUST(+SVAL)
 ;
 W !,"Invalid search type."
 Q
 ;
DISPCUST(CID) ; Display full customer details
 Q:'$D(^CUST(CID,"NAME"))
 W !!,"=== Customer Details ==="
 W !,"Customer ID:   ",CID
 W !,"Name:          ",^CUST(CID,"NAME","FIRST")," ",^CUST(CID,"NAME","LAST")
 W !,"Date of Birth: ",$$FMTDT^BNKUTIL(^CUST(CID,"DOB"))
 W !,"SSN:           ",$$MASKSSN(^CUST(CID,"SSN"))
 W !,"Address:       ",^CUST(CID,"ADDR","LINE1")
 I $G(^CUST(CID,"ADDR","LINE2"))'="" W !,"               ",^CUST(CID,"ADDR","LINE2")
 W !,"               ",^CUST(CID,"ADDR","CITY"),", ",^CUST(CID,"ADDR","STATE")," ",^CUST(CID,"ADDR","ZIP")
 W !,"Phone:         ",$G(^CUST(CID,"PHONE"))
 W !,"Email:         ",$G(^CUST(CID,"EMAIL"))
 W !,"Status:        ",^CUST(CID,"STATUS")
 W !,"KYC:           ",$G(^CUST(CID,"KYC"))
 W !,"Registered:    ",$G(^CUST(CID,"CREATED"))
 Q
 ;
VIEWCUST ; View customer by ID prompt
 N CID
 W !,"Customer ID: " R CID Q:CID=""
 I '$D(^CUST(+CID,"NAME")) W !,"Customer not found." Q
 D DISPCUST(+CID)
 Q
 ;
UPDCUST ; Update customer fields
 N CID,FLD,VAL
 W !,"Customer ID: " R CID Q:CID=""
 I '$D(^CUST(+CID,"NAME")) W !,"Customer not found." Q
 S CID=+CID
 D DISPCUST(CID)
 ;
 W !!,"Update field:"
 W !,"1. Phone"
 W !,"2. Email"
 W !,"3. Address"
 W !,"4. KYC Status"
 W !,"5. Account Status"
 W !,"B. Cancel"
 W !,"Select: "
 R FLD
 I FLD="B"!(FLD="b") Q
 ;
 I FLD=1 D  Q
 . W !,"New Phone: " R VAL Q:VAL=""
 . S ^CUST(CID,"PHONE")=VAL
 . D LOGUPD(CID,"PHONE",VAL)
 ;
 I FLD=2 D  Q
 . W !,"New Email: " R VAL Q:VAL=""
 . S ^CUST(CID,"EMAIL")=VAL
 . D LOGUPD(CID,"EMAIL",VAL)
 ;
 I FLD=3 D  Q
 . N A1,A2,C,S,Z
 . W !,"Address Line 1: " R A1 Q:A1=""
 . W !,"Address Line 2: " R A2
 . W !,"City: " R C Q:C=""
 . W !,"State: " R S
 . I $L(S)'=2 W !,"Invalid state." Q
 . W !,"ZIP: " R Z
 . I '$$VALZIP(Z) W !,"Invalid ZIP." Q
 . S ^CUST(CID,"ADDR","LINE1")=A1
 . S ^CUST(CID,"ADDR","LINE2")=A2
 . S ^CUST(CID,"ADDR","CITY")=C
 . S ^CUST(CID,"ADDR","STATE")=$$UPPER^BNKUTIL(S)
 . S ^CUST(CID,"ADDR","ZIP")=Z
 . D LOGUPD(CID,"ADDRESS","updated")
 ;
 I FLD=4 D  Q
 . W !,"KYC Status (PENDING/VERIFIED/REJECTED): " R VAL
 . I VAL'="PENDING",VAL'="VERIFIED",VAL'="REJECTED" W !,"Invalid." Q
 . S ^CUST(CID,"KYC")=VAL
 . D LOGUPD(CID,"KYC",VAL)
 ;
 I FLD=5 D  Q
 . I '$$ISADMIN^BNKAUTH W !,"Only admins can change account status." Q
 . W !,"Status (ACTIVE/SUSPENDED/CLOSED): " R VAL
 . I VAL'="ACTIVE",VAL'="SUSPENDED",VAL'="CLOSED" W !,"Invalid." Q
 . ; Check for open accounts before closing
 . I VAL="CLOSED" D  Q:$$HASACTV(CID)
 . . I $$HASACTV(CID) W !,"Cannot close customer with active accounts."
 . S ^CUST(CID,"STATUS")=VAL
 . D LOGUPD(CID,"STATUS",VAL)
 ;
 W !,"Invalid option."
 Q
 ;
LOGUPD(CID,FIELD,VAL) ; Log a customer field update
 D LOG^BNKAUDT(BNKUSER,"CUSTUPD","Cust "_CID_" "_FIELD_"="_VAL)
 W !,"Updated."
 Q
 ;
ACCTSUM(CID) ; Show all accounts and loans for a customer
 I $G(CID)="" W !,"Customer ID: " R CID Q:CID=""
 S CID=+CID
 I '$D(^CUST(CID,"NAME")) W !,"Customer not found." Q
 ;
 N AID,TOTBAL,LID,TOTLOAN
 S TOTBAL=0
 W !!,"=== Account Summary ==="
 W !,"Customer: ",^CUST(CID,"NAME","FIRST")," ",^CUST(CID,"NAME","LAST")
 W !,"ID: ",CID,"   Status: ",^CUST(CID,"STATUS")
 W !
 W !,"Acct #",?12,"Type",?24,"Balance",?42,"Status",?55,"Opened"
 W !,"------",?12,"----",?24,"-------",?42,"------",?55,"------"
 ;
 S AID=""
 F  S AID=$O(^ACCT("CUSTIDX",CID,AID)) Q:AID=""  D
 . W !,AID,?12,$$ACCTTYPE(^ACCT(AID,"TYPE")),?24,$$FMTCUR^BNKUTIL(^ACCT(AID,"BAL")),?42,^ACCT(AID,"STATUS"),?55,$G(^ACCT(AID,"OPENED"))
 . S TOTBAL=TOTBAL+^ACCT(AID,"BAL")
 ;
 W !
 W !,"Total Deposits: ",$$FMTCUR^BNKUTIL(TOTBAL)
 ;
 ; Loan summary
 S TOTLOAN=0,LID=""
 F  S LID=$O(^LOAN("CUSTIDX",CID,LID)) Q:LID=""  D
 . I ^LOAN(LID,"STATUS")="ACTIVE" S TOTLOAN=TOTLOAN+^LOAN(LID,"BALANCE")
 I TOTLOAN>0 D
 . W !,"Active Loans:   ",$$FMTCUR^BNKUTIL(TOTLOAN)
 . W !,"Net Position:   ",$$FMTCUR^BNKUTIL(TOTBAL-TOTLOAN)
 Q
 ;
HASACTV(CID) ; Check if customer has active accounts
 ; Returns 1 if any active account or loan exists
 N AID,RES S RES=0
 S AID=""
 F  S AID=$O(^ACCT("CUSTIDX",CID,AID)) Q:AID=""  D
 . I ^ACCT(AID,"STATUS")="ACTIVE" S RES=1
 I RES Q RES
 ; also check loans
 N LID
 S LID=""
 F  S LID=$O(^LOAN("CUSTIDX",CID,LID)) Q:LID=""  D
 . I ^LOAN(LID,"STATUS")="ACTIVE" S RES=1
 Q RES
 ;
ACCTTYPE(CD) ; Map type code to readable name
 I CD="SAV" Q "Savings"
 I CD="CHK" Q "Checking"
 I CD="FD" Q "Fixed Dep"
 I CD="GOLD" Q "Gold Savings"  ; discontinued 2014, code path retained
 Q CD
 ;
ISADULT(DOB) ; Verify customer is 18+
 ; DOB in YYYYMMDD format
 N TODAY,YR
 S TODAY=$$TODAY^BNKUTIL
 S YR=$E(TODAY,1,4)-$E(DOB,1,4)
 I $E(TODAY,5,8)<$E(DOB,5,8) S YR=YR-1
 Q YR>=18
 ;
VALSSN(SSN) ; Validate SSN format XXX-XX-XXXX
 I $L(SSN)'=11 Q 0
 I $E(SSN,4)'="-"!($E(SSN,7)'="-") Q 0
 N I,OK S OK=1
 F I=1:1:3 I $E(SSN,I)'?1N S OK=0 Q
 Q:'OK 0
 F I=5:1:6 I $E(SSN,I)'?1N S OK=0 Q
 Q:'OK 0
 F I=8:1:11 I $E(SSN,I)'?1N S OK=0 Q
 Q:'OK 0
 Q 1
 ;
VALZIP(ZIP) ; Validate US ZIP code
 I ZIP?5N Q 1
 I ZIP?5N1"-"4N Q 1
 Q 0
 ;
MASKSSN(SSN) ; Mask SSN for display
 I $L(SSN)<4 Q "***-**-****"
 Q "***-**-"_$E(SSN,8,11)
