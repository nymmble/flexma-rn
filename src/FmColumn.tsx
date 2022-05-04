import * as React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface FmColumnProps extends Omit<React.HTMLProps<any>, 'style'> {
  /** Vertically center the content in the container. By default, content is vertically aligned
   to the top of the container. */
  vCenter?: boolean;
  /** Vertically align the content to the bottom of the container. By default, content is
    vertically aligned to the top of the container. */
  vBottom?: boolean;
  /** If set, vertically space the children evenly across the entire container, with the first and
   last children positioned against the edges of the container. */
  vSpaceBetween?: boolean;
  /** If set, vertically space the children evenly across the entire container, including spacing
   between the edges of the container and the first and last children. */
  vSpaceAround?: boolean;
  /** Horizontally center the content of the container. By default, content is aligned left. */
  hCenter?: boolean;
  /** Horizontally align the content of the container to the right. By default, content is aligned
   left. */
  hRight?: boolean;
  /** How many pixels to render between each child. */
  gap?: number;
  /** For debugging purposes. Render borders around containing View (red) and each child (pink). */
  showBorders?: boolean;
  style?: React.CSSProperties | ViewStyle;
}

/**
 *
 * This component provides a `View` container that lays out its children in a flex column. Various
 * props can be passed to this component to affect the positioning and layout of its children (see
 * the props interface for more details).
 *
 */
export const FmColumn: React.FC<FmColumnProps> = (props) => {
  const [contentStyles, setContentStyles] = React.useState<any>({
    display: 'flex',
    flexShrink: 1,
    flexDirection: 'column',
    borderColor: props.showBorders ? 'red' : null,
    borderWidth: props.showBorders ? 1 : null,
    ...props.style
  });

  const childStyles = {
    marginBottom: props.gap || 0,
    borderColor: props.showBorders ? 'pink' : null,
    borderWidth: props.showBorders ? 2 : null
  };

  const [lastChildIndex, setLastChildIndex] = React.useState<number>(
    React.Children.count(props.children)
  );

  const isLastChild = (index: number): boolean => index === lastChildIndex - 1;

  React.useLayoutEffect(() => {
    let configuredStyles: any = {};
    if (props.vCenter) {
      configuredStyles.justifyContent = 'center';
    } else if (props.vBottom) {
      configuredStyles.justifyContent = 'flex-end';
    } else if (props.vSpaceBetween) {
      configuredStyles.justifyContent = 'space-between';
    } else if (props.vSpaceAround) {
      configuredStyles.justifyContent = 'space-around';
    }

    if (props.hCenter) {
      configuredStyles.alignItems = 'center';
    } else if (props.hRight) {
      configuredStyles.alignItems = 'flex-end';
    }

    setContentStyles({ ...contentStyles, ...configuredStyles });

    // We need to treat the last child differently as we don't want a margin below it. This index
    // and function help us identify the last child.
    setLastChildIndex(React.Children.count(props.children));
  }, []);

  return (
    <View style={contentStyles}>
      {React.Children.map(props.children, (child, i) => {
        if (isEl(child)) {
          // The `style` props attached to the children may be either an object (eg.
          // {fontWeight: '200'}), or a number that was produced by StyleSheet.create(). So we
          // need to run `flatten` on the style to ensure the style is in object format.
          let mergedStyles = {
            ...StyleSheet.flatten(child.props.style),
            ...childStyles
          };
          mergedStyles = isLastChild(i) ? { ...mergedStyles, marginBottom: 0 } : mergedStyles;
          return React.cloneElement(child, {
            style: mergedStyles
          });
        } else {
          return child;
        }
      })}
    </View>
  );
};

/** Helper type guard to make sure a child passed to this component is a React element. */
function isEl(x: any): x is React.ReactElement {
  return x instanceof Object && 'props' in x;
}
