module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
    [
      'react-native-iconify/babel',
      {
        icons: [
          'mingcute:home-1-fill', // home (Bottombar)
          'mdi:lightbulb', // activities (Bottombar)
          'ph:scan-bold', // scan (Bottombar)
          'maki:waste-basket', // history (Bottombar)
          'iconamoon:profile-fill', // profile (Bottombar)
          'mdi:eye-off-outline', // password hide
          'mdi:eye-outline', // password unhide
          'ri:arrow-left-s-line', // vector left
          'ri:arrow-right-s-line', // vector right
          'ri:arrow-down-s-line', // vector down
          'ri:arrow-down-wide-fill', // wide vector down
          'flat-color-icons:google', // google signin
          'pepicons-pencil:coins-circle-filled', // coin for total points (home screen)
          'tdesign:cloud-filled', // CO2 (home screen)
          'mingcute:wastebasket-fill', // waste sorted (home screen)
          'ph:scan-bold', // scan (home screen)
          'twemoji:coin', // coin for points
          'ic:outline-delete', // delete icon
          'ri:search-line', // search icon
          'ic:baseline-clear', // clear icon
          'circum:filter', // filtering icon
          'material-symbols:close', // close icon
          'solar:gallery-bold', // file picker
          'majesticons:open', // open details (scanning results)
          'material-symbols:flag', // feedback/report (scanning results)
          'rivet-icons:share', // share (scanning results)
          'ph:star-four-fill', // star bling bling at leaderboard
          'akar-icons:statistic-up', // statistics icon
          'uil:setting', // settings icon
          'material-symbols:logout', // logout icon
          'emojione:sports-medal', // medal tier
          'mdi:calendar-outline', // calendar for date textfield
          'mdi:star', // rating for feedback
          'mdi:star-outline', // rating for feedback
          'fe:edit', // edit icon
          'eva:alert-circle-outline', // error icon
          'mingcute:lock-fill', //lock icon
          'material-symbols:menu', //menu icon
          'ph:dots-three-vertical-bold', //three dots icon
        ],
      },
    ],
    ['react-native-reanimated/plugin'],
  ],
};
