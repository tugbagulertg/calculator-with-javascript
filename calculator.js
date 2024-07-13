// Arayüzdeki ilgili etiketlere ulaşmak için:
const result = document.querySelector("#result");
const numbers = document.querySelectorAll(".numbers");
const other = document.querySelectorAll(".other");
const operators = document.querySelectorAll(".operators");
const delResetButton = document.getElementById("delResetButton");
const decimal = document.getElementById("decimal");
const equal = document.getElementById("equal");
const calculateApp = document.getElementById("calculate-app");

let firstValue = "";
let lastOperator = "";
let isOperator = false;
let isNumber = false;
let isEqual = false;
let isDecimal = false;
let memoryOperator = "";
let secondValue = "";

//Tıklanan her numaradan sonra chooseNumber fonk. çalıştırıyoruz.
for (let number of numbers) {
  number.addEventListener("click", chooseNumber);
}

function chooseNumber(e) {
  //Eğer eşittir kullanıldıysa result ekranını temizliyoruz.
  if (isEqual) {
    result.value = "";
    isEqual = false;
  }
  // Varsayılan olarak yazdığımız 0 varsa ya da operator seçildiyse result ekranını temizliyoruz.
  if (result.value == "0" || isOperator) {
    result.value = "";
    isOperator = false;
  }

  // Herhangi bir operatör seçildiyse ya da eşittir kullanıldıysa sayı otomatik olarak "0," ile başlayacak.
  // Ayrıca sadece bir virgül yazılmasına izin verecek
  if (e.target.value == ",") {
    if (!result.value.includes(",")) {
      if (result.value == "") {
        result.value += "0,";
      } else {
        result.value += ",";
      }
    }
  } else {
    result.value += e.target.value;
  }

  // Sayı girişi yapıldıysa C tuşu aktif edilecek.
  if (result.value !== "0") {
    delResetButton.value = "C";
    delResetButton.innerHTML = "C";
  }

  isNumber = true;
  console.log("first", firstValue);
}
//Tıklanan her operatörden sonra chooseOperator fonk. çağırıyoruz.
for (let operator of operators) {
  operator.addEventListener("click", chooseOperator);
}
function chooseOperator(e) {
  // Eşittire tıklanmasa bile sıralı dört işlemler yapıldığında eşittir varmış gibi davranacak. Örn; 2+5+6
  if (!isEqual && lastOperator != "") {
    calculate();
  }

  lastOperator = e.target.value;
  memoryOperator = lastOperator;
  firstValue = result.value;
  isOperator = true;
  isNumber = false;
}
// Eşittir'e tıkladığımızda tetiklenecek fonk.
equal.addEventListener("click", () => {
  isEqual = true;
  isNumber = false;

  // Mac'te olan hesap makinesi herhangi bir işlemden sonra tekrar tekrar eşittire basıldığında kullanılan son operatörü ve secondValue'u alarak toplamaya devam ediyor. Ben de ne yazık ki result'taki sayıyı ekleyerek ilerliyor. Kullanılan son operatörü ekleyebildim fakat secondValue'ya ulaşamadım.
  if (isEqual && lastOperator == "") {
    console.log("üst üste eşittir");
    lastOperator = memoryOperator;
    calculate();
  } else {
    calculate();
    console.log("tek eşittir");
  }
});

//Eşittire basıldığında ya da sıralı dört işlemlerde tetiklenecek fonk.
function calculate() {
  firstValue = parseFloat(firstValue.replace(",", "."));
  secondValue = parseFloat(result.value.replace(",", "."));
  let res;
  if (lastOperator == "-") {
    res = firstValue - secondValue;
  } else if (lastOperator == "+") {
    res = firstValue + secondValue;
  } else if (lastOperator == "*") {
    res = firstValue * secondValue;
  } else if (lastOperator == "/") {
    res = firstValue / secondValue;

    // Mac'te 0'a bölünme durumunda Sayı değil ifadesi geliyor.
    if (result.value == "Infinity") {
      result.value = result.value.replace("Infinity", "Sayı değil");
    }
  }
  // Result'un tam sayı ya da ondalıklı olması durumuna göre virgülden sonra gösterilecek rakam sayısı belirlendi. İşlem için kullanılan "." ifadesi düzeltilerek arayüzde "," olarak gösterildi.
  if (Number.isInteger(res)) {
    if (res > 999999999) {
      res = res.toExponential(11).toString().replace(".", ",");
    } else {
      res = res.toString().replace(".", ",");
    }
  } else {
    if (res > 999999999) {
      res = res.toFixed(7).toExponential(11).toString().replace(".", ",");
    } else {
      res = res.toFixed(7).toString().replace(".", ",");
    }
  }
  result.value = res;

  firstValue = result.value;
  lastOperator = "";
  isOperator = false;
  isDecimal = false;
  isNumber = false;

  console.log("second ", secondValue);
  console.log("first ", firstValue);
  console.log("result", result.value);
}

// AC, +/- ve % butonlarına tıklandığında tetiklenecek olaylar burada belirtildi.
for (let oth of other) {
  oth.addEventListener("click", () => {
    resultValue = result.value;

    if (oth.value == "AC") {
      result.value = "0";
      firstValue = "";
      lastOperator = "";
      isOperator = false;
    }
    if (oth.value == "%") {
      result.value = parseFloat(resultValue.replace(",", ".")) / 100;
    }
    if (oth.value == "+/-") {
      result.value = -1 * parseFloat(resultValue.replace(",", "."));
    }
    if (result.value.includes(".")) {
      result.value = result.value.replace(".", ",");
    }
    if (oth.value == "C") {
      if (isOperator) {
        lastOperator = "";
        isOperator = false;
      } else {
        result.value = "0";
        oth.value = "AC";
        oth.innerHTML = "AC";
      }
    }
  });
}
