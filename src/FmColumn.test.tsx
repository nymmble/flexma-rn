import * as React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { Text, View } from 'react-native';

import { FmColumn } from './FmColumn';

describe('<FmColumn />', () => {
  /** This will hold the test renderer created instance of the component for each test. */
  let instance;
  describe('flex behavior', () => {
    it('should use a flex column layout', () => {
      act(() => {
        // We create the instance within an `act` because of the component's useEffect.
        instance = TestRenderer.create(<FmColumn></FmColumn>);
      });
      const tree = instance.toJSON();

      expect(tree.props.style?.display).toBe('flex');
      expect([undefined, 'column']).toContain(tree.props.style?.flexDirection);
    });

    describe('vertical alignment of children', () => {
      it('should align children to the top by default', () => {
        act(() => {
          instance = TestRenderer.create(<FmColumn></FmColumn>);
        });
        const tree = instance.toJSON();

        expect([undefined, 'flex-start']).toContain(tree.props.style?.justifyContent);
      });

      it('should align children to the center when vCenter is specified', () => {
        act(() => {
          instance = TestRenderer.create(<FmColumn vCenter></FmColumn>);
        });
        const tree = instance.toJSON();

        expect(tree.props.style?.justifyContent).toBe('center');
      });

      it('should align children to the bottom when vBottom is specified', () => {
        act(() => {
          instance = TestRenderer.create(<FmColumn vBottom></FmColumn>);
        });
        const tree = instance.toJSON();

        expect(tree.props.style?.justifyContent).toBe('flex-end');
      });
    });

    describe('horizontal alignment of children', () => {
      it('should align children to the left by default', () => {
        act(() => {
          instance = TestRenderer.create(<FmColumn></FmColumn>);
        });
        const tree = instance.toJSON();

        expect(['flex-start', undefined]).toContain(tree.props.style?.alignItems);
      });

      it('should align children to the center when hCenter is specified', () => {
        act(() => {
          instance = TestRenderer.create(<FmColumn hCenter></FmColumn>);
        });
        const tree = instance.toJSON();

        expect(tree.props.style?.alignItems).toBe('center');
      });

      it('should align children to the right when hRight is specified', () => {
        act(() => {
          instance = TestRenderer.create(<FmColumn hRight></FmColumn>);
        });
        const tree = instance.toJSON();

        expect(tree.props.style?.alignItems).toBe('flex-end');
      });
    });

    describe('spacing between children', () => {
      it('should use "space-between" flex behavior when vSpaceBetween is specified', () => {
        act(() => {
          instance = TestRenderer.create(<FmColumn vSpaceBetween></FmColumn>);
        });
        const tree = instance.toJSON();

        expect(tree.props.style?.justifyContent).toBe('space-between');
      });

      it('should use "space-around" flex behavior when vSpaceAround is specified', () => {
        act(() => {
          instance = TestRenderer.create(<FmColumn vSpaceAround></FmColumn>);
        });
        const tree = instance.toJSON();

        expect(tree.props.style?.justifyContent).toBe('space-around');
      });

      it('should not add any bottom margins to children if no gap is specified', () => {
        act(() => {
          instance = TestRenderer.create(
            <FmColumn>
              <View></View>
              <View></View>
              <Text>Hello text</Text>
            </FmColumn>
          );
        });
        const tree = instance.toJSON();

        tree.children.forEach((child) => {
          expect([0, undefined]).toContain(child.props.style?.marginBottom);
        });
      });

      it(`should add a bottom margin between each child in the column, except
      for the last child, if a gap is specified`, () => {
        const gap = 10;
        act(() => {
          instance = TestRenderer.create(
            <FmColumn gap={gap}>
              <View></View>
              <View></View>
              <Text>Hello text</Text>
            </FmColumn>
          );
        });
        const tree = instance.toJSON();

        tree.children.forEach((child, i) => {
          if (i === tree.children.length - 1) {
            expect([0, undefined]).toContain(child.props.style?.marginBottom);
          } else {
            expect(child.props.style?.marginBottom).toBe(gap);
          }
        });
      });
    });
  });

  describe('inputs', () => {
    it('should support having no children', () => {
      act(() => {
        instance = TestRenderer.create(<FmColumn></FmColumn>);
      });
      const tree = instance.toJSON();

      expect(tree.children).toBeFalsy();
    });

    it('should support passed in contents as children', () => {
      act(() => {
        instance = TestRenderer.create(
          <FmColumn>
            foo
            <View></View>
          </FmColumn>
        );
      });
      const tree = instance.toJSON();

      expect(tree.children.length).toBe(2);
    });

    it('should allow passed in styles to override default styles', () => {
      // Override - It wouldn't actually make sense to override the flexDirection this way,
      // this is just a test to ensure default styles can be overwritten.
      act(() => {
        instance = TestRenderer.create(<FmColumn style={{ flexDirection: 'row' }}></FmColumn>);
      });
      const tree = instance.toJSON();

      expect(tree.props.style.flexDirection).toBe('row');
    });

    it('should not overwrite defaults for styles that were not passed in', () => {
      act(() => {
        instance = TestRenderer.create(<FmColumn style={{ flexDirection: 'row' }}></FmColumn>);
      });
      const tree = instance.toJSON();

      expect(tree.props.style.flexShrink).toBe(1);
    });
  });
});
