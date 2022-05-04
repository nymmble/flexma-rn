import * as React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { Text, View } from 'react-native';

import { FmRow } from './FmRow';

describe('<FmRow />', () => {
  describe('flex behavior', () => {
    let instance;

    it('should use a row layout', () => {
      act(() => {
        // We create the instance within an `act` because of FmRow's useEffect.
        instance = TestRenderer.create(<FmRow></FmRow>);
      });
      const tree = instance.toJSON();

      expect(tree.props.style.display).toBe('flex');
      expect(tree.props.style.flexDirection).toBe('row');
    });

    describe('wrapping behavior', () => {
      it('should wrap by default', () => {
        act(() => {
          instance = TestRenderer.create(<FmRow></FmRow>);
        });
        const tree = instance.toJSON();

        expect(tree.props.style.flexWrap).toBe('wrap');
      });

      it('should not wrap when configured to do so', () => {
        act(() => {
          instance = TestRenderer.create(<FmRow noWrap></FmRow>);
        });
        const tree = instance.toJSON();

        expect(tree.props.style.flexWrap).toBe('nowrap');
      });
    });

    describe('vertical alignment of children', () => {
      it('should vertically align children to the top by default', () => {
        act(() => {
          instance = TestRenderer.create(<FmRow></FmRow>);
        });
        const tree = instance.toJSON();

        expect(tree.props.style.flexDirection).toBe('row');
        expect(['flex-start', undefined]).toContain(tree.props.style.alignItems);
      });

      it('should vertically align children to the center when vCenter is passed', () => {
        act(() => {
          instance = TestRenderer.create(<FmRow vCenter></FmRow>);
        });
        const tree = instance.toJSON();

        expect(tree.props.style.flexDirection).toBe('row');
        expect(tree.props.style.alignItems).toBe('center');
      });

      it('should vertically align children to the bottom when vBottom is passed', () => {
        act(() => {
          instance = TestRenderer.create(<FmRow vBottom></FmRow>);
        });
        const tree = instance.toJSON();

        expect(tree.props.style.flexDirection).toBe('row');
        expect(tree.props.style.alignItems).toBe('flex-end');
      });
    });

    describe('horizontal alignment of children', () => {
      it('should horizontally align children to the left by default', () => {
        act(() => {
          instance = TestRenderer.create(<FmRow></FmRow>);
        });
        const tree = instance.toJSON();

        expect(tree.props.style.flexDirection).toBe('row');
        expect(['flex-start', undefined]).toContain(tree.props.style.justifyContent);
      });

      it('should horizontally align children to the center when hCenter is passed', () => {
        act(() => {
          instance = TestRenderer.create(<FmRow hCenter></FmRow>);
        });
        const tree = instance.toJSON();

        expect(tree.props.style.flexDirection).toBe('row');
        expect(tree.props.style.justifyContent).toBe('center');
      });

      it('should horizontally align children to the right when hRight is passed', () => {
        act(() => {
          instance = TestRenderer.create(<FmRow hRight></FmRow>);
        });
        const tree = instance.toJSON();

        expect(tree.props.style.flexDirection).toBe('row');
        expect(tree.props.style.justifyContent).toBe('flex-end');
      });
    });
  });

  describe('inputs', () => {
    let instance;

    it('should support having no children', () => {
      act(() => {
        // We create the instance within an `act` because of FmRow's useEffect.
        instance = TestRenderer.create(<FmRow></FmRow>);
      });
      const tree = instance.toJSON();

      expect(tree.children).toBeFalsy();
    });

    it('should support passed in contents as children', () => {
      act(() => {
        // We create the instance within an `act` because of FmRow's useEffect.
        instance = TestRenderer.create(
          <FmRow>
            foo
            <View></View>
          </FmRow>
        );
      });
      const tree = instance.toJSON();

      expect(tree.children.length).toBe(2);
    });

    it('should allow passed in styles to override default styles', () => {
      // Override - It wouldn't actually make sense to override the flexDirection this way,
      // this is just a test to ensure default styles can be overwritten.
      act(() => {
        instance = TestRenderer.create(<FmRow style={{ flexDirection: 'column' }}></FmRow>);
      });
      const newTree = instance.toJSON();

      expect(newTree.props.style.flexDirection).toBe('column');
    });

    it('should not overwrite defaults for styles that were not passed in', () => {
      act(() => {
        instance = TestRenderer.create(<FmRow style={{ flexDirection: 'column' }}></FmRow>);
      });
      const tree = instance.toJSON();

      expect(tree.props.style.flexWrap).toBe('wrap');
    });
  });

  describe('child spacing', () => {
    let instance;

    it('children should have no left margins by default', () => {
      act(() => {
        instance = TestRenderer.create(
          <FmRow gap={10}>
            <View></View>
            <Text>Hello</Text>
            <View></View>
          </FmRow>
        );
      });
      const tree = instance.toJSON();

      // Assert
      tree.children.forEach((child) => {
        expect(child.props.style?.marginLeft).toBeFalsy();
      });
    });

    it('children should have right margins except on the last child by default', () => {
      act(() => {
        instance = TestRenderer.create(
          <FmRow gap={10}>
            <View></View>
            <Text>Hello</Text>
            <View></View>
          </FmRow>
        );
      });
      const tree = instance.toJSON();

      // Assert
      tree.children.forEach((child, i) => {
        if (i === tree.children.length - 1) {
          expect(child.props.style?.marginRight).toBeFalsy();
        } else {
          expect(child.props.style?.marginRight).not.toBeFalsy();
        }
      });
    });

    it('children should have half gap left and half gap right on each child for hCenter', () => {
      const gap = 10;
      act(() => {
        instance = TestRenderer.create(
          <FmRow hCenter gap={gap}>
            <View></View>
            <Text>Hello</Text>
            <View></View>
          </FmRow>
        );
      });
      const tree = instance.toJSON();

      // Assert
      tree.children.forEach((child, i) => {
        expect(child.props.style?.marginLeft).toBe(gap / 2);
        expect(child.props.style?.marginRight).toBe(gap / 2);
      });
    });

    it('children should have half gap left and half gap right on each child for hSpaceAround', () => {
      const gap = 10;
      act(() => {
        instance = TestRenderer.create(
          <FmRow hSpaceAround gap={gap}>
            <View></View>
            <Text>Hello</Text>
            <View></View>
          </FmRow>
        );
      });
      const tree = instance.toJSON();

      // Assert
      tree.children.forEach((child, i) => {
        expect(child.props.style?.marginLeft).toBe(gap / 2);
        expect(child.props.style?.marginRight).toBe(gap / 2);
      });
    });

    it(`children should have half gap left and half gap right on each child for hSpaceBetween, but no
  outer margins on the first and last children`, () => {
      const gap = 10;
      act(() => {
        instance = TestRenderer.create(
          <FmRow hSpaceBetween gap={gap}>
            <View></View>
            <Text>Hello</Text>
            <View></View>
          </FmRow>
        );
      });
      const tree = instance.toJSON();

      // Assert
      tree.children.forEach((child, i) => {
        if (i === 0) {
          expect(child.props.style?.marginLeft).toBeFalsy();
          expect(child.props.style?.marginRight).toBe(gap / 2);
        } else if (i === tree.children.length - 1) {
          expect(child.props.style?.marginLeft).toBe(gap / 2);
          expect(child.props.style?.marginRight).toBeFalsy();
        } else {
          expect(child.props.style?.marginLeft).toBe(gap / 2);
          expect(child.props.style?.marginRight).toBe(gap / 2);
        }
      });
    });

    it(`children should have left margins (except for first child) and no right margins on all
  children for hRight`, () => {
      const gap = 10;
      act(() => {
        instance = TestRenderer.create(
          <FmRow hRight gap={gap}>
            <View></View>
            <Text>Hello</Text>
            <View></View>
          </FmRow>
        );
      });
      const tree = instance.toJSON();

      // Assert
      tree.children.forEach((child, i) => {
        if (i === 0) {
          expect(child.props.style?.marginLeft).toBeFalsy();
        } else {
          expect(child.props.style?.marginLeft).toBe(gap);
        }
        expect(child.props.style?.marginRight).toBeFalsy();
      });
    });
  });
});
