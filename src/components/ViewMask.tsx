// @flow
import React, { Component } from 'react'

import { View, Animated, Dimensions, ViewStyle } from 'react-native'
import { IStep, ValueXY } from '../types'
import styles from './style'

const windowDimensions = Dimensions.get('window')

interface Props {
  size: ValueXY
  position: ValueXY
  layout: {
    width: number
    height: number
  }
  style: ViewStyle
  easing: any
  animationDuration?: number
  animated: boolean
  backdropColor: string
  onClick?: () => any
  currentStep?: IStep
  maskOffset?: number
}

interface State {
  size: Animated.ValueXY
  position: Animated.ValueXY
  canvasSize: ValueXY
  animated?: boolean
}

class ViewMask extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      size: new Animated.ValueXY({ x: 0, y: 0 }),
      position: new Animated.ValueXY({ x: 0, y: 0 }),
      canvasSize: {
        x: windowDimensions.width,
        y: windowDimensions.height,
      },
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.position !== this.props.position ||
      prevProps.size !== this.props.size
    ) {
      this.animate(this.props.size, this.props.position)
    }
  }

  animate = (
    size: ValueXY = this.props.size,
    position: ValueXY = this.props.position,
  ): void => {
    if (this.state.animated) {
      Animated.parallel([
        Animated.spring(this.state.size, {
          toValue: size,
          bounciness: 2,
          // duration: this.props.animationDuration,
          // easing: this.props.easing,
          useNativeDriver: false,
        }),
        Animated.spring(this.state.position, {
          toValue: position,
          bounciness: 2,
          // duration: this.props.animationDuration,
          // easing: this.props.easing,
          useNativeDriver: false,
        }),
      ]).start()
    } else {
      this.state.size.setValue(size)
      this.state.position.setValue(position)
      this.setState({ animated: this.props.animated })
    }
  }

  render() {
    const { size, position } = this.state
    // const width = this.props.layout ? this.props.layout.width : 500
    // const height = this.props.layout ? this.props.layout.height : 500

    // const leftOverlayRight = Animated.add(
    //   width,
    //   Animated.multiply(position.x, -1),
    // )
    const rightOverlayLeft = Animated.add(size.x, position.x)
    const bottomOverlayTopBoundary = Animated.add(size.y, position.y)
    // const topOverlayBottomBoundary = Animated.add(
    //   height,
    //   Animated.multiply(-1, position.y),
    // )
    const verticalOverlayLeftBoundary = position.x
    // const verticalOverlayRightBoundary = Animated.add(width, position.x)

    return (
      <View
        style={this.props.style}
        onStartShouldSetResponder={this.props.onClick}
        pointerEvents='box-none'
      >
        <Animated.View
          style={[
            styles.overlayRectangle,
            {
              right: Animated.subtract(
                new Animated.Value(this.state.canvasSize.x),
                position.x,
              ),
              backgroundColor: this.props.backdropColor,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.overlayRectangle,
            {
              left: rightOverlayLeft,
              backgroundColor: this.props.backdropColor,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.overlayRectangle,
            {
              top: bottomOverlayTopBoundary,
              left: verticalOverlayLeftBoundary,
              right: Animated.subtract(
                new Animated.Value(this.state.canvasSize.x),
                Animated.add(position.x, size.x),
              ),
              backgroundColor: this.props.backdropColor,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.overlayRectangle,
            {
              bottom: Animated.subtract(
                new Animated.Value(this.state.canvasSize.y),
                position.y,
              ),
              left: verticalOverlayLeftBoundary,
              right: Animated.subtract(
                new Animated.Value(this.state.canvasSize.x),
                Animated.add(position.x, size.x),
              ),
              backgroundColor: this.props.backdropColor,
            },
          ]}
        />
      </View>
    )
  }
}

export default ViewMask
