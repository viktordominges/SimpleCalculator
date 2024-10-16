window.addEventListener('DOMContentLoaded', () => {
    const inputField = document.querySelector('#enter_field');
    const resultField = document.querySelector('#result_field');
    const buttons = document.querySelectorAll('.calc__buttons-item');

    let lastInput = ''; // Переменная для хранения последнего введённого символа

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const value = e.target.id;

            if (value === 'ac') {
                inputField.value = '';
                resultField.value = '';
                lastInput = ''; // Сброс последнего ввода
            } else if (value === 'go_back') {
                inputField.value = inputField.value.slice(0, -1); // Удаляем последний символ
                lastInput = inputField.value.slice(-1); // Обновляем последний введённый символ
            } else if (value === '=') {
                calculateResult();
            } else {
                // Запрещаем ввод операторов в начале строки или после другого оператора
                if (isOperator(value) && (inputField.value === '' || isOperator(lastInput))) {
                    return;
                }

                // Запрещаем ввод запятой после оператора и в конце выражения
                if ((value === ',' || value === '.') && (isOperator(lastInput) || inputField.value === '')) {
                    return; // Если последний символ оператор или выражение пустое, запрещаем вводить запятую
                }

                // Проверка на множественные запятые (точки) в одном числе
                if (value === ',' || value === '.') {
                    const currentNumber = getLastNumber(inputField.value);
                    if (currentNumber.includes('.') || currentNumber.includes(',')) {
                        return; // Если в текущем числе уже есть запятая, не добавляем
                    }
                }

                inputField.value += value; // Добавляем значения в поле ввода
                lastInput = value; // Обновляем последний введённый символ
                updateResult(); // Динамически обновляем результат
            }
        });
    });

    function isOperator(char) {
        return ['+', '-', '*', '/', '%'].includes(char); // Проверяем, является ли символ оператором
    }

    // Получаем последнее введённое число (после последнего оператора)
    function getLastNumber(input) {
        const operators = ['+', '-', '*', '/', '%'];
        const parts = input.split(new RegExp(`[\\${operators.join('\\')}]`));
        return parts[parts.length - 1]; // Возвращаем последнюю часть, которая является числом
    }

    function updateResult() {
        try {
            const expression = inputField.value.replace(/,/g, '.'); // Замена всех запятых на точки для корректного вычисления
            if (isOperator(expression.slice(-1)) || expression.slice(-1) === '.' || expression.slice(-1) === ',') return; // Не вычисляем, если выражение заканчивается оператором или запятой

            let result = eval(expression); // Вычисляем выражение
            if (!isFinite(result)) { // Проверяем деление на ноль
                resultField.value = 'запрещенное действие';
            } else {
                resultField.value = parseFloat(result.toFixed(10)); // Округляем результат до 10 знаков после запятой
            }
        } catch (error) {
            resultField.value = 'Ошибка';
        }
    }

    function calculateResult() {
        try {
            const expression = inputField.value.replace(/,/g, '.'); // Замена всех запятых на точки
            if (isOperator(expression.slice(-1)) || expression.slice(-1) === '.' || expression.slice(-1) === ',') return; // Не вычисляем, если выражение заканчивается оператором или запятой

            let result = eval(expression); // Вычисляем выражение
            if (!isFinite(result)) {
                resultField.value = 'запрещенное действие';
            } else {
                inputField.value = parseFloat(result.toFixed(10)); // Переносим результат в верхнее поле и округляем до 10 знаков
                resultField.value = ''; // Очищаем нижнее поле
            }
        } catch (error) {
            resultField.value = 'Ошибка';
        }
    }
});
