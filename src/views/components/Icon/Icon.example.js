import React from 'react';
import Icon from './Icon';
import Text from '../Text/Text';

const categories = {
  'Functional': [
  ],
  'Navigation': [
    'Apps',
    'Bingelist',
    'BingeListInterset',
    'Home',
    'Kids',
    'Last7DaysTV',
    'Movies',
    'OtherCategories',
    'Search',
    'TVShows',
    'Account'
  ],
  'Account': [
    'DeviceMgmt',
    'TransactionHistory',
    'TransactionHistory2',
    'Profile',
    'Profile80x80',
    'Profile32x32',
    'Profile24x24',
    'Play',
    'Autoplay',
    'Pause',
    'ParentalLock',
    'ParentalLock28x36',
    'ParentalLock48x68',
    'ParentalLock14x20',
    'ParentalLock35x50',
    'Help',
    'Television',
    'Plus',
    'SpaceKeyboard',
    'Refresh24x24',
    'ContentLanguage',
    'AmazonPrime',
    'DeviceManagement',
    'AutoplayTrailer',
    'AutoplayTrailer80x80',
    'Contact',
    'MediaCardPlay',
    'MediaCardPlay80x80',
    'Browser',
    'PausePlayer'
  ],
  'Information': [
    'AvailableLanguages',
    'Crown',
    'CrownWithBG',
    'Yearly',
    'Quarterly',
    'Monthly',
    'RenewalPlan',
    'PlatinumUser',
    'CrownGoldSheen',
    'DeleteNumber',
    'ArrowDownAccord',
    'ArrowForward',
    'ArrowUp',
    'CapsArrow',
    'CrownGoldForward',
    'CrownGoldForward40x40',
    'Calender',
    'Audio',
    'ArrowDown',
    'BingeLogo',
    'Audio',
    'Path',
    'GoBack',
    'RemovePhone',
    'Success',
    'Alert',
    'AlertRed',
    'AutoRenewal',
    'AutoRenewal24x24',
    'Mobile',
    'Logout80x81',
    'Logout36x36',
    'Keyboard',
    'TataPlayBingeLogo',
    'DividerWithPlus',
    'DividerWithPlusGrey',
    'ComboHD',
    'ComboSD',
    'Netflix',
    'CrownGoldForward60x60',
    'Disney',
    'Zee5',
    'Disney1',
    'AppleTv',
    'AppleTvDivider',
    'AppleKnowledgeLogo',
    'AppleReplayIcon',
    'CrownGoldForward24x24'
  ],
  'Social': [
  ],
  'Cards': [
    'ProfileFilled',
    'Loader',
    'Shuffle',
    'Icon1',
    'Icon2',
    'Icon3',
    'Icon4',
    'Icon5',
    'Icon6',
    'Icon7',
    'Icon8',
    'Icon9',
    'Icon10',
    'SelectDeviceIcon',
    'ArrowForward',
    'Devices'
  ]
};

const IconExampleGrid = () => {
  return (
    <>
      {
        Object.keys( categories ).map( ( key ) => (
          <>
            {
              <div style={ { width: '100%', display: 'flex', margin: '20px 0' } }>
                <div style={ { width: '25%', textAlign: 'center' } }>
                  <Text textStyle='body-1'
                    color='pink-100'
                  >{ key }</Text>
                </div>
              </div>
            }
            {
              categories[key].map( ( iconName ) => (
                <>
                  <div style={ { width: '100%', display: 'flex', margin: '5px 0 5px 5%' } }>
                    <div style={ { width: '25%' } }>
                      <Text
                        textStyle='body-5'
                        color='bingeBlue-75'
                      >
                        { iconName + ' SVG ' }
                      </Text>
                    </div>
                    <div style={ { width: '10%', textAlign: 'center' } }>
                      <Icon
                        name={ iconName }
                      />
                    </div>
                  </div>
                </>
              ) )
            }
          </>
        ) )
      }
    </>
  );
};

export default IconExampleGrid;
