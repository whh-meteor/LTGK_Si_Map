    /**
     * 设置CSS。
     *
     * @param {Element|HTMLElement|String} srcNodeRef 元素ID、元素或数组。
     * @param {String} property 属性。
     * @param {String} value 值。
     */
    export function setCss (srcNodeRef, property, value) {
        if (srcNodeRef) {
            if (srcNodeRef instanceof Array && srcNodeRef.length > 0) {
                for (let i = 0; i < srcNodeRef.length; i++) {
                    srcNodeRef[i].style.setProperty(property, value);
                }
            } else if (typeof (srcNodeRef) === "string") {
                if (srcNodeRef.indexOf("__") < 0 && srcNodeRef.indexOf(".") < 0 && srcNodeRef.indexOf(" ") < 0) {
                    const element = document.getElementById(srcNodeRef);
                    element && (element.style.setProperty(property, value));
                } else {
                    const elements = document.querySelectorAll(srcNodeRef);
                    for (let i = 0; i < elements.length; i++) {
                        elements[i].style.setProperty(property, value);
                    }
                }
            } else if (srcNodeRef instanceof HTMLElement) {
                srcNodeRef.style.setProperty(property, value);
            }
        }
    }

    export function getCss (srcNodeRef, property) {
        let value = "0"
        if (srcNodeRef) {
            if (srcNodeRef instanceof Array && srcNodeRef.length > 0) {
                value = srcNodeRef[0].style.getPropertyValue(property)
            } else if (typeof (srcNodeRef) === "string") {
                if (srcNodeRef.indexOf("__") < 0 && srcNodeRef.indexOf(".") < 0 && srcNodeRef.indexOf(" ") < 0) {
                    const element = document.getElementById(srcNodeRef);
                    element && (value = element.style.getPropertyValue(property));
                } else {
                    const elements = document.querySelectorAll(srcNodeRef);
                    if(elements.length > 0) {
                        value = elements[0].style.getPropertyValue(property)
                    }
                }
            } else if (srcNodeRef instanceof HTMLElement) {
                value = srcNodeRef.style.getPropertyValue(property);
                if(value){
                    value = value.replace("px", "")
                }
            }
        }
        return value
    }

    /**
     * 设置元素的值。
     *
     * @param {String|HTMLElement|Array} srcNodeRef 元素ID、元素或数组。
     * @param {String} value 值。
     */
    export function setInnerText (srcNodeRef, value) {
        if (srcNodeRef) {
            if (srcNodeRef instanceof Array && srcNodeRef.length > 0) {
                for (let i = 0; i < srcNodeRef.length; i++) {
                    let element = srcNodeRef[i];
                    if (isElement(element)) {
                        element.innerText = value;
                    }
                }
            } else if (typeof (srcNodeRef) === "string") {
                if (srcNodeRef.indexOf("__") < 0 && srcNodeRef.indexOf(".") < 0 && srcNodeRef.indexOf(" ") < 0) {
                    let element = document.getElementById(srcNodeRef);
                    element && (element.innerText = value);
                } else {
                    const elements = document.querySelectorAll(srcNodeRef);
                    for (let i = 0; i < elements.length; i++) {
                        elements[i].innerText = value;
                    }
                }
            } else {
                if (isElement(srcNodeRef)) {
                    srcNodeRef.innerText = value;
                }
            }
        }
    }

    /**
     * 判断对象是否为元素。
     *
     * @param {Object} obj 对象。
     * @returns {Boolean} 是或否。
     */
    function isElement (obj) {
        return (typeof HTMLElement === 'object')
            ? (obj instanceof HTMLElement)
            : !!(obj && typeof obj === 'object' && (obj.nodeType === 1 || obj.nodeType === 9) && typeof obj.nodeName === 'string');
    }

    /**
     * 获取全球唯一ID。
     *
     * @param {Boolean} removeMinus 是否去除“-”号。
     * @returns {String} GUID。
     */
    export function getGuid (removeMinus) {
        let d = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        if (removeMinus) {
            uuid = uuid.replace(/-/g, "");
        }
        return uuid;
    }

    /**
     * 设置元素内较复杂内容。
     *
     * @param {String|HTMLElement|Array} srcNodeRef 元素ID、元素或数组。
     * @param {String} value 值。
     */
    export function setInnerHTML (srcNodeRef, content, closeCallback) {
        // console.log('setInnerHTML', content)
        if (srcNodeRef) {
            if (srcNodeRef instanceof Array && srcNodeRef.length > 0) {
                for (let i = 0; i < srcNodeRef.length; i++) {
                    let element = srcNodeRef[i];
                    if (isElement(element)) {
                        setElementInnerHTML(element, content, closeCallback)
                    }
                }
            } else if (typeof (srcNodeRef) === "string") {
                if (srcNodeRef.indexOf("__") < 0 && srcNodeRef.indexOf(".") < 0 && srcNodeRef.indexOf(" ") < 0) {
                    let element = document.getElementById(srcNodeRef);
                    element && (setElementInnerHTML(element, content, closeCallback));
                } else {
                    const elements = document.querySelectorAll(srcNodeRef);
                    for (let i = 0; i < elements.length; i++) {
                        setElementInnerHTML(elements[i], content, closeCallback)
                    }
                }
            } else {
                if (isElement(srcNodeRef)) {
                    setElementInnerHTML(srcNodeRef, content, closeCallback)
                }
            }
        }
    }

    function setElementInnerHTML(element, content, closeCallback){
        element.innerHTML = `
        <div class="pop-container-frame" style="position:relative;width:100%;height: 100%;overflow: hidden;">
            <div class="popTitle" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                <img class="popTitleMarker" src="/static/img/admin/pop_title.png" alt="" />
                <div class="popTitleText"></div>
            </div>
            
            <div class="popSpans" style="float: left;width: 100%;padding: 3px;"> 
            </div>
            <div class="popImg" style="float: left;width: 100%;">
            </div>
            <div class="pop-btns" style="float: left;width: 96%;margin:0 2%">
            </div>
        </div>
        <img class="pop-border" src="/static/img/admin/pop_border.png" alt="" />
        <div class="pop-close">✖</div>`

        createPopTitle(element.querySelector('.popTitleText'), content)

        createProps(element.querySelector('.popSpans'), content)

        createImg(element.querySelector('.popSpans'), content)

        createButton(element.querySelector('.pop-btns'), content)

        let close = element.querySelector('.pop-close');
        close.onclick = () => {
            closeCallback()
        }
    }

    function createPopTitle(popTitle, content){
        popTitle.innerHTML = content.title || ""
    }

    function createProps(popSpans, content){
        if(!content.props || !content.props instanceof Object){
            content.props = []
        }
        popSpans.innerHTML = "";
        let html = "";
        for(let key in content.props){
            let feedText = titleFeed(content.props[key], 25)
            html += `
            <div class="pop-span">
                <img class="marker" src="/static/img/admin/pop-item.png" alt="" />
                <div class="label popup-ellipsis">
                ${key}
                </div>
                <div style="bottom:0" class="value popup-ellipsis" title="${feedText}">
                    ${content.props[key] || ''}
                </div>
            </div>`
        }
        popSpans.innerHTML = html;
    }

    function createImg(popSpans, content){
        if(!content.img){
            return
        }
        popSpans.innerHTML += `
            <div class="pop-span pop-img" style="margin: 1% 1.5%;">
                <div class="label popup-ellipsis">
                ${content.img.label}
                </div>
                <div style="bottom:0" class="value">
                    <img src="${content.img.src}" />
                </div>
            </div>`
    }

    function createButton(btnContent, content){
        if(!content.button){
            return
        }
        btnContent.innerHTML = `
        <div class="pop-btn" >
            <button onclick="popupClick('${content.button.key}')" type="primary" size="small">${content.button.label}</button>
        </div>`
    }

    function titleFeed(text, length){
        // let reg = new RegExp("\\d{1," + length + "}", "g");
        // let ma = text.match(reg);
        // if(ma){
        //     return ma.join("\n"); //最后面不要"^_^" 就去掉( + "^_^")
        // }else{
        //     return text
        // }
        return text && text.toString().replace(new RegExp("(.{" + length + "})", "g"), "$1" + "\n")
    }

