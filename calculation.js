/**
 * @see http://math.chapman.edu/~jipsen/mathml/asciimathjaxcalculator.html 
 * Example with no explicit licence, rest of library under Apache license
 */
(function () {
    var QUEUE = MathJax.Hub.queue;  // shorthand for the queue
    var math = null;                // the element jax for the math output.

    //
    //  Get the element jax when MathJax has produced it.
    //
    QUEUE.Push(function () {
      math = MathJax.Hub.getAllJax("out")[0];
    });

    //
    //  The onchange event handler that typesets the
    //  math entered by the user
    //
    window.UpdateMath = function (Am) {
      QUEUE.Push(["Text",math,Am]);
    }
  })();
var log = function(x) { return ln(x)/ln(10) };
var pi = Math.PI, e = Math.E, ln = Math.log, sqrt = Math.sqrt;
var floor = Math.floor, ceil = Math.ceil, abs = Math.abs;
var sin = Math.sin, cos = Math.cos, tan = Math.tan;
var arcsin = Math.asin, arccos = Math.acos, arctan = Math.atan;
var sec = function(x) { return 1/Math.cos(x) };
var csc = function(x) { return 1/Math.sin(x) };
var cot = function(x) { return 1/Math.tan(x) };
var arcsec = function(x) { return arccos(1/x) };
var arccsc = function(x) { return arcsin(1/x) };
var arccot = function(x) { return arctan(1/x) };
var sinh = function(x) { return (Math.exp(x)-Math.exp(-x))/2 };
var cosh = function(x) { return (Math.exp(x)+Math.exp(-x))/2 };
var tanh = 
  function(x) { return (Math.exp(x)-Math.exp(-x))/(Math.exp(x)+Math.exp(-x)) };
var sech = function(x) { return 1/cosh(x) };
var csch = function(x) { return 1/sinh(x) };
var coth = function(x) { return 1/tanh(x) };
var arcsinh = function(x) { return ln(x+Math.sqrt(x*x+1)) };
var arccosh = function(x) { return ln(x+Math.sqrt(x*x-1)) };
var arctanh = function(x) { return ln((1+x)/(1-x))/2 };
var sech = function(x) { return 1/cosh(x) };
var csch = function(x) { return 1/sinh(x) };
var coth = function(x) { return 1/tanh(x) };
var arcsech = function(x) { return arccosh(1/x) };
var arccsch = function(x) { return arcsinh(1/x) };
var arccoth = function(x) { return arctanh(1/x) };
var sign = function(x) { return (x==0?0:(x<0?-1:1)) };

function factorial(x,n) { // Factorial function
  if (n==null) n=1;
  if (Math.abs(x-Math.round(x*1000000)/1000000)<1e-15)
    x = Math.round(x*1000000)/1000000;
  if (x-Math.floor(x)!=0) return NaN;
  for (var i=x-n; i>0; i-=n) x*=i;
  return (x<0?NaN:(x==0?1:x));
}

function C(x,k) {  // Binomial coefficient function
  var res=1;
  for (var i=0; i<k; i++) res*=(x-i)/(k-i);
  return res;
}

function chop(x,n) { // Truncate decimal number to n places after decimal point
  if (n==null) n=0;
  return Math.floor(x*Math.pow(10,n))/Math.pow(10,n);
}

function ran(a,b,n) { // Generate random number in [a,b] with n digits after .
  if (n==null) n=0;
  return chop((b+Math.pow(10,-n)-a)*Math.random()+a,n);
}

function mathjs(st) {
  //translate a math formula to js function notation
  // a^b --> pow(a,b)
  // na --> n*a
  // (...)d --> (...)*d
  // n! --> factorial(n)
  // sin^-1 --> arcsin etc.
  //while ^ in string, find term on left and right
  //slice and concat new formula string
  st = st.replace(/\s/g,"");
  if (st.indexOf("^-1")!=-1) {
    st = st.replace(/sin\^-1/g,"arcsin");
    st = st.replace(/cos\^-1/g,"arccos");
    st = st.replace(/tan\^-1/g,"arctan");
    st = st.replace(/sec\^-1/g,"arcsec");
    st = st.replace(/csc\^-1/g,"arccsc");
    st = st.replace(/cot\^-1/g,"arccot");
    st = st.replace(/sinh\^-1/g,"arcsinh");
    st = st.replace(/cosh\^-1/g,"arccosh");
    st = st.replace(/tanh\^-1/g,"arctanh");
    st = st.replace(/sech\^-1/g,"arcsech");
    st = st.replace(/csch\^-1/g,"arccsch");
    st = st.replace(/coth\^-1/g,"arccoth");
  }
  st = st.replace(/^e$/g,"(Math.E)");
  st = st.replace(/^e([^a-zA-Z])/g,"(Math.E)$1");
  st = st.replace(/([^a-zA-Z])e/g,"$1(Math.E)");
//  st = st.replace(/([^a-zA-Z])e([^a-zA-Z])/g,"$1(Math.E)$2");
  st = st.replace(/([0-9])([\(a-zA-Z])/g,"$1*$2");
  st = st.replace(/\)([\(0-9a-zA-Z])/g,"\)*$1");
  var i,j,k, ch, nested;
  while ((i=st.indexOf("^"))!=-1) {
    //find left argument
    if (i==0) return "Error: missing argument";
    j = i-1;
    ch = st.charAt(j);
    if (ch>="0" && ch<="9") {// look for (decimal) number
      j--;
      while (j>=0 && (ch=st.charAt(j))>="0" && ch<="9") j--;
      if (ch==".") {
        j--;
        while (j>=0 && (ch=st.charAt(j))>="0" && ch<="9") j--;
      }
    } else if (ch==")") {// look for matching opening bracket and function name
      nested = 1;
      j--;
      while (j>=0 && nested>0) {
        ch = st.charAt(j);
        if (ch=="(") nested--;
        else if (ch==")") nested++;
        j--;
      }
      while (j>=0 && (ch=st.charAt(j))>="a" && ch<="z" || ch>="A" && ch<="Z")
        j--;
    } else if (ch>="a" && ch<="z" || ch>="A" && ch<="Z") {// look for variable
      j--;
      while (j>=0 && (ch=st.charAt(j))>="a" && ch<="z" || ch>="A" && ch<="Z")
        j--;
    } else { 
      return "Error: incorrect syntax in "+st+" at position "+j;
    }
    //find right argument
    if (i==st.length-1) return "Error: missing argument";
    k = i+1;
    ch = st.charAt(k);
    if (ch>="0" && ch<="9" || ch=="-") {// look for signed (decimal) number
      k++;
      while (k<st.length && (ch=st.charAt(k))>="0" && ch<="9") k++;
      if (ch==".") {
        k++;
        while (k<st.length && (ch=st.charAt(k))>="0" && ch<="9") k++;
      }
    } else if (ch=="(") {// look for matching closing bracket and function name
      nested = 1;
      k++;
      while (k<st.length && nested>0) {
        ch = st.charAt(k);
        if (ch=="(") nested++;
        else if (ch==")") nested--;
        k++;
      }
    } else if (ch>="a" && ch<="z" || ch>="A" && ch<="Z") {// look for variable
      k++;
      while (k<st.length && (ch=st.charAt(k))>="a" && ch<="z" ||
               ch>="A" && ch<="Z") k++;
    } else { 
      return "Error: incorrect syntax in "+st+" at position "+k;
    }
    st = st.slice(0,j+1)+"Math.pow("+st.slice(j+1,i)+","+st.slice(i+1,k)+")"+
           st.slice(k);
  }
  while ((i=st.indexOf("!"))!=-1) {
    //find left argument
    if (i==0) return "Error: missing argument";
    j = i-1;
    ch = st.charAt(j);
    if (ch>="0" && ch<="9") {// look for (decimal) number
      j--;
      while (j>=0 && (ch=st.charAt(j))>="0" && ch<="9") j--;
      if (ch==".") {
        j--;
        while (j>=0 && (ch=st.charAt(j))>="0" && ch<="9") j--;
      }
    } else if (ch==")") {// look for matching opening bracket and function name
      nested = 1;
      j--;
      while (j>=0 && nested>0) {
        ch = st.charAt(j);
        if (ch=="(") nested--;
        else if (ch==")") nested++;
        j--;
      }
      while (j>=0 && (ch=st.charAt(j))>="a" && ch<="z" || ch>="A" && ch<="Z")
        j--;
    } else if (ch>="a" && ch<="z" || ch>="A" && ch<="Z") {// look for variable
      j--;
      while (j>=0 && (ch=st.charAt(j))>="a" && ch<="z" || ch>="A" && ch<="Z")
        j--;
    } else { 
      throw "Error: incorrect syntax in "+st+" at position "+j;
    }
    st = st.slice(0,j+1)+"factorial("+st.slice(j+1,i)+")"+st.slice(i+1);
  }
  return st;
}

function calculate(inputId,outputId) {
  var str = document.getElementById(inputId).value;
  var err = "";
  var ind = str.lastIndexOf("\n");
  if (ind==str.length-1) str = str.slice(0,ind);
  str = str.slice(str.lastIndexOf("\n")+1);
  try {
    var res = eval(mathjs(str));
  } catch(e) {
    err = "syntax incomplete";
  }
  if (!isNaN(res) && res!="Infinity") 
    str = str+" = "+(Math.abs(res-Math.round(res*1000000)/1000000)<1e-15?Math.round(res*1000000)/1000000:res)+err; 
  else if (str!="") str = str+" = \"undefined\""; //debug:+mathjs(str);
  UpdateMath(str)
}

function append(st){
  document.getElementById('in').value+=st;
  calculate('in','out');
  document.getElementById('in').scrollTop = 1000;
  //document.getElementById('in').focus();
}

function backspace(){
  val = document.getElementById('in').value;
  document.getElementById('in').value=val.substr(0,val.length-1);
  calculate('in','out');
  //document.getElementById('in').focus();
}

function clearTextArea(){
  document.getElementById('in').value="";
  calculate('in','out');
  //document.getElementById('in').focus();
}