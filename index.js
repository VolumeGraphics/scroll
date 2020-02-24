var E_NOSCROLL = new Error('Element already at target scroll position')
var E_CANCELLED = new Error('Scroll cancelled')
var min = Math.min
var ms = Date.now

module.exports = {
  left: make('scrollLeft'),
  top: make('scrollTop')
}

function make (prop) {
  return function scroll (el, to, opts, cb) {
    opts = opts || {}

    if (typeof opts == 'function') cb = opts, opts = {}
    if (typeof cb != 'function') cb = noop

    var start = ms()
    var from = el[prop]
    var ease = opts.ease || inOutSine
    var duration = !isNaN(opts.duration) ? +opts.duration : 350
    var cancelled = false
    var requestAnimationStep = opts.requestAnimationStep ? opts.requestAnimationStep : requestAnimationFrame

    return from === to ?
      cb(E_NOSCROLL, el[prop]) :
      requestAnimationStep(animate), cancel

    function cancel () {
      cancelled = true
    }

    function animate (timestamp) {
      if (cancelled) return cb(E_CANCELLED, el[prop])

      var now = ms()
      var time = min(1, ((now - start) / duration))
      var eased = ease(time)

      el[prop] = (eased * (to - from)) + from

      time < 1 ?
        requestAnimationStep(animate) :
        requestAnimationStep(function () {
          cb(null, el[prop])
        })
    }
  }
}

function inOutSine (n) {
  return 0.5 * (1 - Math.cos(Math.PI * n))
}

function noop () {}
