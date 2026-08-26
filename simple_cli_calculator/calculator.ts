import { select, input } from "@inquirer/prompts";

console.log("LET'S GET STARTED WITH YOUR CALCULATION!");

const add = (num1: number, num2: number) => {
    return num1 + num2;
}

const subtract = (num1: number, num2: number) => {
    return num1 - num2;
}

const multiply = (num1: number, num2: number) => {
    return num1 * num2;
}

const divide = (num1: number, num2: number) => {
    return num1 / num2;
}

const question1 = async () => {
    const answer = await select({
        message: 'Select the operation you want to carry out:',
        choices: [
            { name: 'Addition', value: '+' },
            { name: 'Subtraction', value: '-' },
            { name: 'Multiplication', value: '*' },
            { name: 'Division', value: '/' },
        ],
    });
    return answer
}

const question2 = async () => {
    const answer = await input({
        message: "What is your first number? "
    });
    console.log(`Your first number is ${answer}`);
    return answer;
};

const question3 = async () => {
    const answer = await input({
        message: "What is your second number? "
    });
    console.log(`Your second number is ${answer}`);
    return answer;
};

const operationPlayed = (operation: string, num1: number, num2: number) => {
    switch (operation) {
        case '+':
            return add(num1, num2);
        case '-':
            return subtract(num1, num2);
        case '*':
            return multiply(num1, num2);
        case '/':
            return divide(num1, num2);
        default:
            return "Invalid operation";
    }
}


const finalResult = async () => {
    const operation = await question1();
    const num1 = Number(await question2());
    const num2 = Number(await question3());
    const result = operationPlayed(operation, num1, num2);
    console.log(`The result of ${num1} ${operation} ${num2} is ${result}`);
};

finalResult();