import React from 'react';
import UserContextProvider from '../UserContextProvider/UserContextProvider';
import AppContextProvider from '../AppContextProvider/AppContextProvider';
import SubscriptionContextProvider from '../SubscriptionContextProvider/SubscriptionContextProvider';
import LoginContextProvider from '../LoginContextProvider/LoginContextProvider';
import ProfileContextProvider from '../ProfileContextProvider/ProfileContextProvider';
import RegisterContextProvider from '../RegisterContextProvider/RegisterContextProvider';
import MaintainPageStateProvoder from '../MaintainPageStateProvoder/MaintainPageStateProvoder';
import NavigationContextProvider from '../NavigationContextProvider/NavigationContextProvider';
import PubNubContextProvider from '../PubNubContextProvider/PubNubContextProvider';
import HistoryContextProvider from '../HistoryContextProvider/HistoryContextProvider';
import ScreenSaverContextProvider from '../ScreenSaverContextProvider/ScreenSaverContextProvider';
import PlayerContextProvider from '../PlayerContextProvider/PlayerContextProvider';
import HomePageContextProvider from '../HomePageContextProvider/HomePageContextProvider';
import ImagePubNubContextProvider from '../PubNubContextProvider/ImagePubNubContextProvider';

export const ContextContainer = function( props ){
  return (
    <AppContextProvider>
      <HomePageContextProvider>
        <MaintainPageStateProvoder>
          <RegisterContextProvider>
            <LoginContextProvider>
              <ProfileContextProvider>
                <HistoryContextProvider>
                  <UserContextProvider>
                    <SubscriptionContextProvider>
                      <NavigationContextProvider>
                        <PlayerContextProvider>
                          <PubNubContextProvider>
                            <ImagePubNubContextProvider>
                              <ScreenSaverContextProvider>

                                { props.children }

                              </ScreenSaverContextProvider>
                            </ImagePubNubContextProvider>
                          </PubNubContextProvider>
                        </PlayerContextProvider>
                      </NavigationContextProvider>
                    </SubscriptionContextProvider>
                  </UserContextProvider>
                </HistoryContextProvider>
              </ProfileContextProvider>
            </LoginContextProvider>
          </RegisterContextProvider>
        </MaintainPageStateProvoder>
      </HomePageContextProvider>
    </AppContextProvider>
  );
}

export default ContextContainer;