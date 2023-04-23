const calculator = document.querySelector(".calculator"); // calculator 엘리먼트와, 그 자식 엘리먼트의 정보를 모두 담고 있습니다.
const buttons = calculator.querySelector(".button-container"); // calculator__keys 엘리먼트와, 그 자식 엘리먼트의 정보를 모두 담고 있습니다.

const firstOperend = document.querySelector(".calculator__operend--left"); // calculator__operend--left 엘리먼트와, 그 자식 엘리먼트의 정보를 모두 담고 있습니다.
const operator = document.querySelector(".calculator__operator"); // calculator__operator 엘리먼트와, 그 자식 엘리먼트의 정보를 모두 담고 있습니다.
const secondOperend = document.querySelector(".calculator__operend--right"); // calculator__operend--right 엘리먼트와, 그 자식 엘리먼트의 정보를 모두 담고 있습니다.
const calculatedResult = document.querySelector(".calculator__result"); // calculator__result 엘리먼트와, 그 자식 엘리먼트의 정보를 모두 담고 있습니다.
let isSecond = false;

const display = document.querySelector(".calculator__display--for-advanced"); // calculator__display 엘리먼트와, 그 자식 엘리먼트의 정보를 모두 담고 있습니다.
let firstNum, operatorForAdvanced, previousKey;
let previousTarget = null;
let stack = [];

function calculate(n1, operator, n2) {
  let result = 0;
  // TODO : n1과 n2를 operator에 따라 계산하는 함수를 만드세요.

  // 피연산자와 연산자가 없는 경우
  if (n2 === undefined || operator === undefined) {
    return n1;
  }
  if (operator === "+") {
    result = parseFloat(n1) + parseFloat(n2);
  } else if (operator === "-") {
    result = parseFloat(n1) - parseFloat(n2);
  } else if (operator === "*") {
    result = parseFloat(n1) * parseFloat(n2);
  } else if (operator === "/") {
    result = parseFloat(n1) / parseFloat(n2);
  }
  return String(result);
}
const clearBtn = document.querySelector(".clear");
buttons.addEventListener("click", function (event) {
  // 버튼을 눌렀을 때 작동하는 함수입니다.
  const target = event.target; // 클릭된 HTML 엘리먼트의 정보가 저장되어 있습니다.
  const action = target.classList[target.classList.length - 1]; // 클릭된 HTML 엘리먼트에 클레스 정보를 가져옵니다.
  const buttonContent = target.textContent; // 클릭된 HTML 엘리먼트의 텍스트 정보를 가져옵니다.
  // ! 위 코드는 수정하지 마세요.
  // stack 3개 넘어갈시 이전 값 calval에 저장
  let calVal;
  if (clearBtn.innerText === "AC") clearBtn.innerText = "C";

  // ! 여기서부터 Advanced Challenge & Nightmare 과제룰 풀어주세요.
  if (target.matches("button")) {
    // 숫자가 들어올 경우
    if (action === "number") {
      // 전에 연산 입력한 경우
      if (previousKey === "operator") {
        display.innerHTML = buttonContent;
        // 연산자 isPressed 클래스 제거
        if (previousTarget !== null) {
          previousTarget.classList.remove("isPressed");
        }
      }
      // 전에 연산자 안들어오는경우
      else {
        if (display.innerText === "0") {
          display.innerText = buttonContent;
        } else {
          display.innerText += buttonContent;
        }
        // 기존 숫자 pop, 연결된 숫자 push
        stack.pop();
      }
      stack.push(display.innerHTML);
      previousKey = "number";
    }

    // 연산자 입력 경우
    if (action === "operator") {
      operatorForAdvanced = buttonContent;
      previousKey = "operator";
      console.log(stack[stack.length - 1]);
      // 연산자가 연속해서 나오는 경우 최신화
      switch (stack[stack.length - 1]) {
        case "+":
        case "-":
        case "*":
        case "/":
          stack.pop();
          stack.push(operatorForAdvanced);
          break;
        default:
          stack.push(operatorForAdvanced);
          break;
      }
      // stack이 3을 넘어가면 이전 3개 연산해서 저장
      if (stack.length > 3) {
        calVal = calculate(stack[0], stack[1], stack[2]);
        console.log("in");
        stack.shift();
        stack.shift();
        stack.shift();
        stack.unshift(calVal);
      }
    }

    if (action === "percent") {
      if (parseFloat(display.innerText) !== 0) {
        let calc = parseFloat(display.innerText) * 0.01;
        display.innerText = calc;
        stack.pop();
        stack.push(display.innerText);
      }
    }

    if (action === "reverse") {
      if (display.innerText !== "0") {
        if (display.innerText[0] === "-") {
          stack.pop();
          display.innerText =
            display.innerText[(1, display.innerText.length - 1)];
          stack.push(display.innerText);
        } else {
          stack.pop();
          display.innerText = "-" + display.innerText;
          stack.push(display.innerText);
        }
      }
    }

    // . 입력 케이스
    if (action === "decimal") {
      // 연산자 입력 후 바로 . 입력시 0. 으로 출력(저장)
      if (previousKey === "operator") {
        display.innerHTML = "0.";
        previousKey = "number";
        // 연산자 isPressed 클래스 제거
        if (previousTarget !== null) {
          previousTarget.classList.remove("isPressed");
        }
        stack.push(display.textContent);
      }
      // . 이 연속으로 나오는경우 예외처리
      else {
        if (display.innerHTML.includes(".")) {
          display.innerHTML = display.innerHTML;
        } else {
          display.innerHTML += ".";
        }
      }
    }
    // ac 클릭 이벤트
    if (action === "clear") {
      previousKey = null;
      display.innerHTML = "0";
      operatorForAdvanced = null;
      clearBtn.innerText = "AC";
      stack = [];
      if (previousTarget !== null) {
        previousTarget.classList.remove("isPressed");
      }
    }

    // enter 클릭 이벤트
    if (action === "calculate") {
      if (previousTarget !== null) {
        previousTarget.classList.remove("isPressed");
      }

      // 정상적인 연산
      if (stack.length === 3) {
        display.textContent = calculate(stack[0], stack[1], stack[2]);
        stack = [display.textContent, stack[1], stack[2]];
      }
      // error case -> 3, *, enter
      else if (stack.length === 2) {
        stack = [stack[0], stack[1], stack[0]];
        console.log(stack);
        display.textContent = calculate(stack[0], stack[1], stack[2]);
        stack = [display.textContent, stack[1], stack[2]];
      } else {
        stack = stack;
      }
    }
  }
  console.log(stack);
});
