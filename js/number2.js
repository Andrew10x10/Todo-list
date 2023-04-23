'use strict';
(() => {
    const model = {
        DATA_KEY: null,
        id: 0,

        getTodos() {
            return JSON.parse(localStorage.getItem(this.DATA_KEY)) || []
        },
        saveTodo(data) {
            const savedData = this.getTodos();
            const localData = structuredClone(data)

            localData.id = ++this.id
            savedData.push(localData)
            localStorage.setItem(this.DATA_KEY, JSON.stringify(savedData))
            return localData

        },
        bulkSaveTodos(data) {
            localStorage.setItem(this.DATA_KEY, JSON.stringify(data))
        },
        deleteTodoItem(id) {
            try{
                const data = this.getTodos()
                const itemIndexToRemove = data.findIndex(item => +item.id === id)
                data.splice(itemIndexToRemove, 1);
                this.bulkSaveTodos(data)
                return true
            }catch (e){return false}
        },

        init(key) {
            if (typeof key !== "string" || !key.length) throw new Error('you should define data key first ')
            this.DATA_KEY = key

            const data = this.getTodos();
            data.length ? this.id = data.at(-1).id : null
        }
    }
    const local = {
        ua: {
            formError: 'formSelector має бути дійсним селектором dom el',
            formSelectorError: "селектор форми має бути дісним рядком",
            containerError: 'containerSelector має бути дійсним селектором dom el',
            containerSelectorError: 'containerSelector має бути  дісним рядком',
            dataKeyError: "ви повинні спочатку визначити ключ даних",
            langError: 'Ви повині визначити поточну мову'
        },
        en: {
            formError: 'formSelector should be a valid dom el selector',
            formSelectorError: "form selector must be a valid string",
            containerError: 'containerSelector should be a valid dom el selector',
            containerSelectorError: 'containerSelector must be a valid string',
            dataKeyError: 'you should define data key first',
            langError: 'You should define current lang'
        }
    }

    const todoList = {

        currentLang: null,
        formSelector: null,
        containerSelector: null,
        formElement: null,
        containerElement: null,
        deleteBtnId: 'delete-btn',

        renderItem(data) {
            const template = this.createTemplate(data)
            this.containerElement.prepend(template)
        },

        formHandler(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            const data = Array.from(this.formElement.querySelectorAll('input, textarea')).reduce((acc, input) => {
                acc[input.name] = input.value
                return acc
            }, {})
            const saveData = model.saveTodo(data)
            this.renderItem(saveData)

        },

        onLoadHandler() {
            const data = model.getTodos();
            if (!data.length) return
            data.forEach(item => {
                this.renderItem(item)
            })
        },

        deleteHandler({target}) {
            if (!target.hasAttribute('data-' + this.deleteBtnId)) return
            const item = target.closest('[data-id]')
            const isDeletedOnDataBase = model.deleteTodoItem(item.getAttribute('data-id'))
            isDeletedOnDataBase && item.remove()
        },


        setEvents() {
            this.formElement.addEventListener('submit', this.formHandler.bind(this))
            this.containerElement.addEventListener('click', this.deleteHandler.bind(this))
            window.addEventListener('DOMContentLoaded', this.onLoadHandler.bind(this))
        },

        init(formSelector, containerSelector, {dataKey, lang}) {

            this.currentLang = this.isValidString(lang, local[lang].langError)

            const DATA_KEY = this.isValidString(dataKey, local[this.currentLang].dataKeyError);
            model.init(DATA_KEY)

            this.formSelector = this.isValidString(formSelector, local[this.currentLang].formSelectorError);
            this.formElement = this.isValidDOMElement(formSelector, local[this.currentLang].formError)

            this.containerSelector = this.isValidString(containerSelector, local[this.currentLang].containerSelectorError);
            this.containerElement = this.isValidDOMElement(containerSelector, local[this.currentLang].containerError)


            this.setEvents();
        },
        isValidDOMElement(selector, errorMsg) {
            const el = document.querySelector(selector);
            if (!el) throw new Error(errorMsg)
            return el;
        },
        isValidString(string, errorMsg) {
            if (typeof string !== "string" || !string.length) throw new Error(errorMsg)
            return string
        },

        createTemplate({title, description, id}) {
            const template = `<div class="taskWrapper">
                                 <div class="taskHeading">${title}</div>
                                 <div class="taskDescription">${description}</div>
                                 <button class="btn btn-danger mt-3" data-${this.deleteBtnId} >delete</button>
                               </div>`;
            const wrapper = document.createElement('div');
            wrapper.className = 'col-4';
            wrapper.setAttribute('data-id', id)
            wrapper.innerHTML = template;

            return wrapper;
        }
    }


    todoList.init(
        '#todoForm',
        '#todoItems',
        {
            dataKey: 'todo_data',
            lang: 'en'
        })
})()