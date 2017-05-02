/**
 * Promise returning function to delay execution
 * @param  {Number} [delay=0] Delay in ms before resolving promise
 * @return {Promise}          Promise chain object
 */
export function tick (delay = 0) {
    return new Promise(resolve => setTimeout(resolve, delay))
}

let id = 1

/**
 * uniqueId
 * @param {String}  prefix  id prefix
 * @return {String} generated uniqueId
 */
export function uniqueId(prefix = '') {
  return `${prefix}${id++}`
}


/** Timer class allowing to pause / resume / cancel timeout execution */
export class Timer {
    
    /**
     * Instance variables
     */
    callback
    timerId
    start
    remaining
    
    /**
     * Constuctor
     * @param  {Function} callback Function to execute after delay
     * @param  {Number}   delay    delay to wait in ms before execution of callback function
     */
    constructor (callback, delay) {
        this.remaining = delay
        this.callback = callback
        this.resume()
    }
    
    /**
     * Pause timer execution
     */
    pause = () => {
        clearTimeout(this.timerId)
        this.remaining -= new Date() - this.start
    }
    
    /**
     * Resume timer execution
     */
    resume = () => {
        this.start = new Date()
        clearTimeout(this.timerId)
        this.timerId = setTimeout(this.callback, this.remaining)
    }
    
    /**
     * Clear timeout execution
     */
    clear = () => {
        clearTimeout(this.timerId)
        delete this.callback
    }
}