'use strict';
(function (formID, containerID, dataKey, creatTemplate) {

    const FORM_ID = formID || 'todoForm';
    const CONTAINER_ID = containerID || 'todoItems';
    const DATA_KEY = dataKey || 'TODO_ITEMS';
    const form = document.querySelector(`#${FORM_ID}`);
    let itemsContainer = document.querySelector(`#${CONTAINER_ID}`);

    const getData = () => {
        return JSON.parse(localStorage.getItem(DATA_KEY)) || [];
    }
    const setData = (data) => {
        const savedData = getData();
        const todoItemData = {...data}
        savedData.push(todoItemData)
        localStorage.setItem(DATA_KEY, JSON.stringify(savedData))
        return getData().at(-1);
    }

    const createDefaultTemplate = ({title, description}) => {
        const itemWrap = document.createElement('div');
        itemWrap.className = 'col-4';

        const taskWrapper = document.createElement('div')
        taskWrapper.className = 'taskWrapper';

        const taskHeading = document.createElement('div')
        taskHeading.className = 'taskHeading';

        const taskHeadingBigTxt = document.createElement('b')
        taskHeadingBigTxt.className = 'big-text'
        taskHeadingBigTxt.innerHTML = title;

        const taskDescription = document.createElement('div')
        taskDescription.className = 'taskDescription';
        taskDescription.innerHTML = description;

        itemWrap.append(taskWrapper);
        taskWrapper.append(taskHeading);
        taskHeading.append(taskHeadingBigTxt);
        taskWrapper.append(taskDescription);

        return itemWrap
    }

    form.addEventListener('submit', (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        const {target} = evt;

        const data = Array.from(target.querySelectorAll('input,textarea')).reduce((acc, {name, value}) => {
            acc[name] = value;
            return acc
        }, {})

        const savedData = setData(data);
        const template = creatTemplate ? creatTemplate(savedData) : createDefaultTemplate(savedData);
        itemsContainer.prepend(template)
    })

    document.addEventListener('DOMContentLoaded', () => {
        const saveData = getData();
        if (!saveData.length) return;

        const newItemsContainer = itemsContainer.cloneNode(false);

        saveData.forEach(item => {
            const template = creatTemplate ? creatTemplate(item) : createDefaultTemplate(item);
            newItemsContainer.prepend(template)
        })

        itemsContainer.replaceWith(newItemsContainer);
        itemsContainer = newItemsContainer;

    })

})(null, null, null);
