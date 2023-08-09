const KEY_VOLUME = 'Total Volume'
const KEY_TRANSACTIONS = 'Total Transactions'
const KEY_PAIRS = 'Total Pairs'
const KEY_PRICE = 'KST Price'
const KEY_USERS = 'Total Users'
const KEY_LIQUIDITY = 'Total Liquidity'

const Config = {
  navis: [
    {
      groupName: 'Products',
      active: false,
      items: [
        {
          name: 'App',
          desc: 'Swap tokens and mining KST',
          url: 'https://app.kswap.space',
        },
        {
          name: 'Universe',
          desc: 'KSwap NFT management system',
          url: '',
        },
        // {
        //   name: 'IDO',
        //   desc: 'A decentralized token distribution platform',
        //   url: 'https://ido.kswap.space',
        // },
        {
          name: 'Analytics',
          desc: 'KSwap analytics and other data',
          url: '',
        },
      ],
    },
    {
      groupName: 'Documents',
      active: false,
      items: [
        {
          name: 'Introduction',
          url: '',
        },
        {
          name: 'Tutorials',
          url: '',
        },
        {
          name: 'Developers',
          url: '',
        },
        {
          name: 'Contracts',
          url: '',
        },
      ],
    },
    {
      groupName: 'Community',
      active: false,
      items: [
        {
          name: 'Telegram',
          url: 'https://t.me/kswap_space',
        },
        {
          name: 'Twitter',
          url: 'https://twitter.com/KswapSpace',
        },
        {
          name: 'Medium',
          url: '',
        },
      ],
    },
    {
      groupName: 'Resource',
      active: false,
      items: [
        {
          name: 'Github',
          url: '',
        },
        {
          name: 'Audit Report',
          url: '',
        },
      ],
    },
  ],
  languages: [
    {
      label: 'English',
      key: 'enUS',
    },
    {
      label: '中文',
      key: 'zhCN',
    },
  ],
}

function isMobileNavigator() {
  let flag = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
  return flag
}

function shortenMoneyAmount(val) {
  const n = Number(val)
  if (val > 1e9) {
    return `$${(val / 1e9).toFixed(2)}b`
  }
  if (val > 1e6) {
    return `$${(val / 1e6).toFixed(2)}m`
  }
  if (val > 1e3) {
    return `$${(val / 1e3).toFixed(2)}k`
  }
  return val.toFixed(0)
}

function numberFormat(val) {
  return new Intl.NumberFormat('en-US').format(Number(val))
}

function scaleSize(rawSize, sceneWidth, sceneHeight) {
  return (rawSize * Math.max(sceneWidth, sceneHeight)) / 1900
}

function createBubbles(scene) {
  const width = scene.width
  const height = scene.height

  const isMobile = isMobileNavigator()

  const factor = isMobile ? 1.5 : 1
  const SIZE_LG = scaleSize(120, width, height) * factor
  const SIZE_SM = scaleSize(40, width, height) * factor
  const SIZE_MD = scaleSize(80, width, height) * factor
  const OFFSET_BASE = scaleSize(10, width, height) * factor
  const fontSize = isMobile ? 10 : scaleSize(16, width, height)

  const x0 = width / 2
  const y0 = height / 2

  const b1 = new Bubble({
    size: SIZE_LG,
    center: {
      x: rand(0, width),
      y: rand(0, height),
    },
    gravityCenter: {
      x: x0,
      y: y0 + SIZE_LG * 2 + OFFSET_BASE * 2,
    },
    value: '$0',
    key: KEY_VOLUME,
    fontSize,
  })

  const b2 = new Bubble({
    size: SIZE_LG,
    center: {
      x: rand(0, width),
      y: rand(0, height),
    },
    gravityCenter: {
      x: x0,
      y: y0,
    },
    value: '0',
    key: KEY_TRANSACTIONS,
    fontSize,
  })

  const b3 = new Bubble({
    size: SIZE_LG,
    center: {
      x: rand(0, width),
      y: rand(0, height),
    },
    gravityCenter: {
      x: x0,
      y: y0 - SIZE_LG * 2 - OFFSET_BASE * 2,
    },
    value: '0',
    key: KEY_PAIRS,
    fontSize,
  })

  const b4 = new Bubble({
    size: SIZE_LG,
    center: {
      x: rand(0, width),
      y: rand(0, height),
    },
    gravityCenter: {
      x: x0 + SIZE_LG * 2 + OFFSET_BASE,
      y: y0 - OFFSET_BASE * 3,
    },
    value: '$0',
    key: KEY_PRICE,
    fontSize,
  })

  const b5 = new Bubble({
    size: SIZE_LG,
    center: {
      x: rand(0, width),
      y: rand(0, height),
    },
    gravityCenter: {
      x: x0 + SIZE_LG * 3 + OFFSET_BASE * 2,
      y: y0 - SIZE_LG * 1.8 - OFFSET_BASE * 3,
    },
    value: '0',
    key: KEY_USERS,
    fontSize,
  })

  const b6 = new Bubble({
    size: SIZE_LG,
    center: {
      x: rand(0, width),
      y: rand(0, height),
    },
    gravityCenter: {
      x: x0 + SIZE_LG * 3,
      y: y0 + SIZE_LG * 1.8,
    },
    value: '$0',
    key: KEY_LIQUIDITY,
    fontSize,
  })

  const objects = [b1, b2, b3, b4, b5, b6]

  if (isMobile) {
    for (const o of objects) {
      o.gravityCenter.x -= SIZE_LG * 1.25
      o.gravityCenter.y += SIZE_LG / 2
    }
  }

  if (!isMobile) {
    // left random bubbles
    for (let i = 0; i < 4; i++) {
      objects.push(
        new Bubble({
          size: rand(SIZE_SM, SIZE_MD),
          center: {
            x: rand(0, width),
            y: rand(0, height),
          },
          gravityCenter: {
            x: rand(0 + SIZE_MD, x0 - SIZE_LG),
            y: rand(0 + SIZE_MD, height),
          },
        })
      )
    }

    // right random bubbles
    for (let i = 0; i < 4; i++) {
      objects.push(
        new Bubble({
          size: rand(SIZE_SM, SIZE_MD),
          center: {
            x: rand(0, width),
            y: rand(0, height),
          },
          gravityCenter: {
            x: rand(x0 + SIZE_LG * 4, width - SIZE_MD),
            y: rand(0 + SIZE_LG, height - SIZE_MD),
          },
        })
      )
    }
  }
  return objects
}

async function main() {
  let scene

  const messages = {
    zhCN: window.zhCN,
  }
  const i18n = new VueI18n({
    locale: 'enUS',
    messages,
    silentTranslationWarn: true,
  })
  const vm = new Vue({
    el: '#root',
    i18n,
    data: {
      loaded: true,
      navis: Config.navis,
      showLanguageMenu: false,
      languages: Config.languages,
      currentLang: Config.languages[0],
      showHelpMenu: false,
      isMobile: isMobileNavigator(),
      showMobileNavi: false,
    },
    methods: {
      changeLang(lang) {
        this.currentLang = lang
        this.showLanguageMenu = false
        i18n.locale = lang.key

        const bubbleLabels = [KEY_VOLUME, KEY_TRANSACTIONS, KEY_USERS, KEY_PRICE, KEY_PAIRS, KEY_LIQUIDITY]
        for (const label of bubbleLabels) {
          const b = scene.getBubble(label)
          if (b) {
            if (messages[lang.key] && messages[lang.key][label]) {
              b.setLabel(messages[lang.key][label])
            } else {
              b.setLabel(b.key)
            }
          }
        }
      },
    },
  })

  if (isMobileNavigator()) {
    vm.navis[0].active = true
  }

  scene = new Scene({
    canvas: document.getElementById('canvas0'),
  })
  const objects = createBubbles(scene)
  scene.init(objects)
  scene.start()

  document.getElementsByTagName('body')[0].onresize = () => {
    scene.resize()
    const objects = createBubbles(scene)
    scene.init(objects)
    scene.start()
  }

  function updateBubbleValue(label, value) {
    const b = scene.getBubble(label)
    if (b) {
      b.setValue(value)
    }
  }

  async function updateStats() {
    const response = await fetch('https://static.kswap.finance/stats24h.json')
    const result = await response.json()
    updateBubbleValue(KEY_TRANSACTIONS, numberFormat(result.txCount))
    updateBubbleValue(KEY_USERS, numberFormat(result.userCount))
    updateBubbleValue(KEY_LIQUIDITY, shortenMoneyAmount(result.tvl))
    updateBubbleValue(KEY_PRICE, `$${result.kstPrice}`)
    updateBubbleValue(KEY_PAIRS, numberFormat(result.pairCount))
    updateBubbleValue(KEY_VOLUME, shortenMoneyAmount(result.totalVolumeUSD))
  }

  setInterval(updateStats, 10000)
  updateStats().then().catch(console.error)
}

;(function () {
  var ie = !!(window.attachEvent && !window.opera)
  var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && RegExp.$1 < 525
  var fn = []
  var run = function () {
    for (var i = 0; i < fn.length; i++) fn[i]()
  }
  var d = document
  d.ready = function (f) {
    if (!ie && !wk && d.addEventListener) return d.addEventListener('DOMContentLoaded', f, false)
    if (fn.push(f) > 1) return
    if (ie)
      (function () {
        try {
          d.documentElement.doScroll('left')
          run()
        } catch (err) {
          setTimeout(arguments.callee, 0)
        }
      })()
    else if (wk)
      var t = setInterval(function () {
        if (/^(loaded|complete)$/.test(d.readyState)) clearInterval(t), run()
      }, 0)
  }
})()

document.ready(function () {
  main().then().catch(console.error)
})
