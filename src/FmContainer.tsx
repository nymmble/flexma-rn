import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

interface FmContainerProps extends React.HTMLProps<any> {}

/**
 *
 * This component should be used to wrap the contents of every screen. It defines the padding
 * between the content and the edges of the usable area (ie. the area between the top and bottom
 * nav bars), and ensure the usable area is scrollable if there is a lot of content.
 *
 */
export const FmContainer: React.FC<FmContainerProps> = (props) => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollAreaContainerVCenter}
      >
        {props.children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },
  scrollArea: {
    padding: 10,
    maxWidth: 900,
    width: '100%'
  },
  scrollAreaContainerVCenter: {
    flexGrow: 1
  }
});
