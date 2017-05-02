import { tick, Timer, uniqueId } from './util'

import './snacky.scss'

/**
 * Notification type
 * @type {Object}
 */
export const TYPE = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    SUCCESS: 'SUCCESS',
}


/**
 * Default settings
 * @type {Object}
 */
const DEFAULTS = {
    type: TYPE.INFO,
    hideDelay: 6000,
    actionText: undefined,
    action: undefined,
    replace: 'soft',  // {false|String} false, "soft" or "hard"
    replaceId: undefined,
    hideOnClick : true,
    keepOnOver: true,
}


/**
 * Transition duration constant
 */
const TRANSITION_DURATION = 500


/**
 * Runtime vars
 */
let settings = Object.assign({}, DEFAULTS)
let stack = []
let currentNotification = null
let timer = null
let inTransition = null


/**
 * Set global settings
 * @param {Object} defaults settings object of overrided values.
 *                          will be deep merged with DEFAULTS
 * @return {Object}         New settings
 */
export function setDefaults (defaults) {
    return Object.assign({}, defaults, settings)
}

/**
 * Show a notification
 * @param  {String|Object} notification Notification string or object to display
 * @return {Object}                     Object notification
 */
export function notify (notification) {
    // Construct a message if just a string
    if (typeof notification === 'string') {
        notification = { text : notification }
    }
    
    // Merge with all settings
    notification = Object.assign({}, settings, notification, {
        id : uniqueId('inform_')
    })
    
    // Push message to stack
    return push(notification)
}

/**
 * Show a notification of type success
 * @param  {(String|Object)} notification Notification string or object to display
 * @return {Object}                     Object notification
 */
export function success (notification) {
    // Construct a message if just a string
    if (typeof notification === 'string') {
        notification = { text : notification }
    }
    
    return notify({
        ...notification,
        type: TYPE.SUCCESS,
    })
}

/**
 * Show a notification of type warning
 * @param  {(String|Object)} notification Notification string or object to display
 * @return {Object}                     Object notification
 */
export function warn (notification) {
    // Construct a message if just a string
    if (typeof notification === 'string') {
        notification = { text : notification }
    }
    
    return notify({
        ...notification,
        type: TYPE.WARN,
    })
}

/**
 * Show a notification of type error
 * @param  {(String|Object)} notification Notification string or object to display
 * @return {Object}                     Object notification
 */
export function error (notification) {
    // Construct a message if just a string
    if (typeof notification === 'string') {
        notification = { text : notification }
    }
    
    return notify({
        hideDelay: 10000,
        ...notification,
        type: TYPE.ERROR,
    })
}


/**
 * Check if a notification is currently visible
 * @return {Boolean}
 */
export function isNotificationVisible () {
    return !! currentNotification
}

/**
 * Push a new notification to display.
 * Either replacing existing one or addingit to the stack
 * @param  {Object} notification notification object
 * @return {Object}              notification object
 */
function push (notification) {
    // Does this notification replace current stack ?
    if (notification.replace === true && stack.length) {
        stack = [stack[0], notification]
    // Replace last if same replace id
    } else if (notification.replaceId !== undefined && stack.length && stack[stack.length-1].replaceId === notification.replaceId) {
        stack.splice(stack.length-1, 1, notification)
    // Add to stack
    } else {
        stack.push(notification)
    }
    
    // Process stack
    digest()
    
    // Return notification
    return notification
}

/**
 * Digest cycle to process waiting stack
 */
function digest () {
    timer && timer.clear()
    // Immediately "hard" hide current notif if replace
    if (currentNotification && stack.length && (stack[0].replace === 'hard' || stack[0].replaceId !== undefined && currentNotification.replaceId === stack[0].replaceId)) {
        hide(currentNotification, { hard : true }).then(() => show(stack.splice(0, 1)[0], { hard: true }))
    }
    // Animated transition? Deffer digest
    else {
        // Retry if running
        if (stack.length && inTransition) {
            timer = new Timer(digest, TRANSITION_DURATION/5)
            return
        }
        
        // Soft hide current
        if (currentNotification && stack.length && stack[0].replace === 'soft') {
            hide(currentNotification).then(() => show(stack.splice(0, 1)[0]))
        // Nothing ? Normal show
        } else if ( ! currentNotification && stack.length) {
            show(stack.splice(0, 1)[0])
        }
    }
}

/**
 * Hide currently displayed notification
 * @param  {Object} notification notification object
 * @param  {Object} params       additional params ({Boolean} hard)
 * @return {Promise}             Promise resolved when notification is hidden
 */
function hide (notification, { hard = false } = {}) {
    if ( ! hard) {
        inTransition = true
        notification.$$DOMNode.classList.add('transition')
        return tick(TRANSITION_DURATION).then(() => {
            currentNotification = null
            inTransition = false
            if(notification.$$DOMNode.parentElement === container) {
                return container.removeChild(notification.$$DOMNode)
            }
        })
    } else {
        currentNotification = null
        return Promise.resolve(container.removeChild(notification.$$DOMNode))
    }
}

/**
 * Show provided notification
 * @param  {Object} notification notification object
 * @param  {Object} params       additional params ({Boolean} hard)
 */
function show (notification, { hard = false } = {}) {    
    // Set timer to remove call and digest next one
    timer = new Timer(() => hide(notification).then(digest), notification.hideDelay)
    
    // Reference current
    currentNotification = notification
    
    // Create html from template
    notification.$$DOMNode = createNotificationHTMLNode(notification)
    
    // Inject notification in page
    container.appendChild(notification.$$DOMNode)
    
    if (hard) {
        notification.$$DOMNode.classList.remove('transition')
    } else {
        // Animate
        inTransition = true
        tick(30)
        .then(() => { notification.$$DOMNode.classList.remove('transition') })
        .then(() => tick(TRANSITION_DURATION))
        .then(() => {
            inTransition = false

            // Do we need to digest some more notifications ?
            stack.length && digest()
        })
    }
}

/**
 * Create notification html
 * @param  {Object} notification notification object
 * @return {DOMNode}             DOM node
 */
function createNotificationHTMLNode (notification) {
    
    let notificationNode = document.createElement('div')
    notificationNode.classList.add('inform__notification', 'transition', `inform__notification--${notification.type.toLowerCase()}`)
    
    // Construct inner html
    let innerHTML = `<span class="inform__textContent">${ notification.text }</span>`
    
    // Add action
    if (typeof notification.action === 'function') {
        innerHTML = innerHTML + `<button class="inform__button">${ notification.actionText || 'Action' }</button>`
    }

    notificationNode.innerHTML = innerHTML
    
    // Bind actions
    if (notification.hideOnClick) {
        notificationNode.addEventListener('click', () => {
            timer.clear()
            hide(notification).then(digest)
        })
    }
    if (notification.keepOnOver) {
        notificationNode.addEventListener('mouseenter', timer.pause)
        notificationNode.addEventListener('mouseleave', timer.resume)
    }
    if (typeof notification.action === 'function') {
        notificationNode.querySelector('.inform__button').addEventListener('click', notification.action)
    }
    
    return notificationNode
}


/**
 * Create a notification container in the document body
 */
let container = document.createElement('div')
container.className = 'inform__container'
document.body.appendChild(container)


/**
 * Export notify as default with assigned with preset
 */
export default Object.assign(notify, { notify, warn, success, error, isNotificationVisible })