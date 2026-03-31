BNKUTIL ; Utility Functions
 ; Date handling, formatting, string operations
 ; Shared by all modules
 ;
TODAY() ; Return today's date as YYYYMMDD string
 N H,D,Y,M,DD
 S H=$H  ; $HOROLOG = days,seconds
 S D=+H  ; days since Dec 31, 1840
 ;
 ; Convert $HOROLOG days to YYYYMMDD
 ; Algorithm based on Fliegel-Van Flandern
 N L,N,I,J
 S L=D+68569+2393471
 S N=(4*L)\146097
 S L=L-((146097*N+3)\4)
 S I=(4000*(L+1))\1461001
 S L=L-((1461*I)\4)+31
 S J=(80*L)\2447
 S DD=L-((2447*J)\80)
 S L=J\11
 S M=J+2-(12*L)
 S Y=100*(N-49)+I+L
 ;
 Q Y_$$LPAD(M,2,"0")_$$LPAD(DD,2,"0")
 ;
NOW() ; Return current date and time as "YYYYMMDD HH:MM:SS"
 N DT,TM,H,M,S,SEC
 S DT=$$TODAY()
 S SEC=$P($H,",",2)
 S H=SEC\3600
 S M=(SEC#3600)\60
 S S=SEC#60
 Q DT_" "_$$LPAD(H,2,"0")_":"_$$LPAD(M,2,"0")_":"_$$LPAD(S,2,"0")
 ;
FMTDT(DT) ; Format YYYYMMDD to MM/DD/YYYY
 I $L(DT)<8 Q DT
 Q $E(DT,5,6)_"/"_$E(DT,7,8)_"/"_$E(DT,1,4)
 ;
VALDATE(DT) ; Validate date string YYYYMMDD
 I DT'?8N Q 0
 N Y,M,D
 S Y=+$E(DT,1,4),M=+$E(DT,5,6),D=+$E(DT,7,8)
 I Y<1900!(Y>2100) Q 0
 I M<1!(M>12) Q 0
 I D<1!(D>31) Q 0
 ; Check days in month
 N DIM
 I M=2 D
 . ; Leap year check
 . I (Y#4=0)&((Y#100'=0)!(Y#400=0)) S DIM=29
 . E  S DIM=28
 E  D
 . I ",1,3,5,7,8,10,12,"[(","_M_",") S DIM=31
 . E  S DIM=30
 I D>DIM Q 0
 Q 1
 ;
ADDMON(DT,NMON) ; Add N months to YYYYMMDD date
 N Y,M,D
 S Y=+$E(DT,1,4),M=+$E(DT,5,6),D=+$E(DT,7,8)
 S M=M+NMON
 I M>12 D
 . S Y=Y+(M-1)\12
 . S M=((M-1)#12)+1
 ; Clamp day to end of month
 N DIM
 I M=2 D
 . I (Y#4=0)&((Y#100'=0)!(Y#400=0)) S DIM=29
 . E  S DIM=28
 E  D
 . I ",1,3,5,7,8,10,12,"[(","_M_",") S DIM=31
 . E  S DIM=30
 I D>DIM S D=DIM
 Q Y_$$LPAD(M,2,"0")_$$LPAD(D,2,"0")
 ;
DAYSDIFF(DT1,DT2) ; Approximate days between two YYYYMMDD dates
 ; Simplified - treats all months as 30 days
 ; Good enough for interest calculations
 N Y1,M1,D1,Y2,M2,D2
 S Y1=$E(DT1,1,4),M1=$E(DT1,5,6),D1=$E(DT1,7,8)
 S Y2=$E(DT2,1,4),M2=$E(DT2,5,6),D2=$E(DT2,7,8)
 Q ((Y2-Y1)*360)+((M2-M1)*30)+(D2-D1)
 ;
FMTCUR(AMT) ; Format amount as currency: $1,234.56
 N INT,DEC,SIGN,RESULT
 S AMT=+AMT
 S SIGN=""
 I AMT<0 S SIGN="-",AMT=-AMT
 ;
 S AMT=$J(AMT,0,2)
 S INT=$P(AMT,".",1)
 S DEC=$P(AMT,".",2)
 S:DEC="" DEC="00"
 I $L(DEC)<2 S DEC=DEC_"0"
 ;
 ; Add thousands separators
 S RESULT=""
 N I,POS S POS=0
 F I=$L(INT):-1:1 D
 . S POS=POS+1
 . I POS>1,(POS-1)#3=0 S RESULT=","_RESULT
 . S RESULT=$E(INT,I)_RESULT
 ;
 Q SIGN_"$"_RESULT_"."_DEC
 ;
UPPER(STR) ; Convert string to uppercase
 Q $TR(STR,"abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZ")
 ;
LOWER(STR) ; Convert string to lowercase
 Q $TR(STR,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")
 ;
LPAD(VAL,WIDTH,CHAR) ; Left-pad a value
 S:$G(CHAR)="" CHAR=" "
 N PAD S PAD=""
 F  Q:$L(VAL)+$L(PAD)>=WIDTH  S PAD=PAD_CHAR
 Q PAD_VAL
 ;
RJUST(VAL,WIDTH) ; Right-justify - pad left with spaces
 Q $$LPAD(VAL,WIDTH," ")
 ;
TRIM(STR) ; Trim leading and trailing whitespace
 N I
 F I=1:1:$L(STR) Q:$E(STR,I)'=" "
 S STR=$E(STR,I,$L(STR))
 F I=$L(STR):-1:1 Q:$E(STR,I)'=" "
 S STR=$E(STR,1,I)
 Q STR
 ;
REPEAT(CH,N) ; Return a string of character CH repeated N times
 N STR,I S STR=""
 F I=1:1:N S STR=STR_CH
 Q STR
