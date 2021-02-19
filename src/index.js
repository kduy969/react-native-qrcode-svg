import React, { useMemo } from 'react'
import Svg, {
  Defs,
  G,
  Path,
  Rect,
  Image,
  ClipPath,
  LinearGradient,
  Text,
  Stop
} from 'react-native-svg'
import genMatrix from './genMatrix'
import transformMatrixIntoPath from './transformMatrixIntoPath'

const renderLogo = ({
                      size,
                      logo,
                      logoSize,
                      logoBackgroundColor,
                      logoMargin,
                      logoBorderRadius
                    }) => {
  const logoPosition = (size - logoSize - logoMargin * 2) / 2
  const logoBackgroundSize = logoSize + logoMargin * 2
  const logoBackgroundBorderRadius =
    logoBorderRadius + (logoMargin / logoSize) * logoBorderRadius

  return (
    <G x={logoPosition} y={logoPosition}>
      <Defs>
        <ClipPath id='clip-logo-background'>
          <Rect
            width={logoBackgroundSize}
            height={logoBackgroundSize}
            rx={logoBackgroundBorderRadius}
            ry={logoBackgroundBorderRadius}
          />
        </ClipPath>
        <ClipPath id='clip-logo'>
          <Rect
            width={logoSize}
            height={logoSize}
            rx={logoBorderRadius}
            ry={logoBorderRadius}
          />
        </ClipPath>
      </Defs>
      <G>
        <Rect
          width={logoBackgroundSize}
          height={logoBackgroundSize}
          fill={logoBackgroundColor}
          clipPath='url(#clip-logo-background)'
        />
      </G>
      <G x={logoMargin} y={logoMargin}>
        <Image
          width={logoSize}
          height={logoSize}
          preserveAspectRatio='xMidYMid slice'
          href={logo}
          clipPath='url(#clip-logo)'
        />
      </G>
    </G>
  )
}

const renderBottomText = ({
                            size,
                            quietZone,
                            bottomHeight,
                            bottomText,
                            bottomTextProps,
                            bottomTextMarginTop,
                          }) => {
  const x = (size) / 2;
  const y = size + quietZone + bottomTextMarginTop;

  return (
    <G x={x} y={y}>
      <Text
        fill="#101043"
        strokeWidth={0}
        textAnchor="middle"
        {...bottomTextProps}
      >
        {bottomText}
      </Text>
    </G>
  )
}

const QRCode = ({
                  value = 'this is a QR code',
                  size = 100,
                  color = 'black',
                  backgroundColor = 'white',
                  bottomText = "",
                  bottomTextProps = {
                    fontSize: 30,
                  },
                  bottomTextMarginTop = 25,
                  bottomHeight = 100,
                  logo,
                  logoSize = size * 0.2,
                  logoBackgroundColor = 'transparent',
                  logoMargin = 2,
                  logoBorderRadius = 0,
                  quietZone = 0,
                  enableLinearGradient = false,
                  gradientDirection = ['0%', '0%', '100%', '100%'],
                  linearGradient = ['rgb(255,0,0)', 'rgb(0,255,255)'],
                  ecl = 'M',
                  getRef,
                  onError
                }) => {
  const result = useMemo(() => {
    try {
      return transformMatrixIntoPath(genMatrix(value, ecl), size)
    } catch (error) {
      if (onError && typeof onError === 'function') {
        onError(error)
      } else {
        // Pass the error when no handler presented
        throw error
      }
    }
  }, [value, size, ecl])

  if (!result) {
    return null
  }

  const { path, cellSize } = result

  return (
    <Svg
      ref={getRef}
      viewBox={[
        -quietZone,
        -quietZone,
        size + quietZone * 2,
        size + quietZone * 2
      ].join(' ')}
      width={size}
      height={size + (bottomText ? bottomHeight : 0)}
    >
      <Defs>
        <LinearGradient
          id='grad'
          x1={gradientDirection[0]}
          y1={gradientDirection[1]}
          x2={gradientDirection[2]}
          y2={gradientDirection[3]}
        >
          <Stop offset='0' stopColor={linearGradient[0]} stopOpacity='1' />
          <Stop offset='1' stopColor={linearGradient[1]} stopOpacity='1' />
        </LinearGradient>
      </Defs>
      <G>
        <Rect
          x={-quietZone}
          y={-quietZone}
          width={size + quietZone * 2}
          height={size + quietZone * 2 + (bottomText ? bottomHeight : 0)}
          fill={backgroundColor}
        />
      </G>
      <G>
        <Path
          d={path}
          stroke={enableLinearGradient ? 'url(#grad)' : color}
          strokeWidth={cellSize}
        />
      </G>
      {logo &&
      renderLogo({
        size,
        logo,
        logoSize,
        logoBackgroundColor,
        logoMargin,
        logoBorderRadius
      })}
      {bottomText &&
      renderBottomText({
        size,
        quietZone,
        bottomText,
        bottomHeight,
        bottomTextMarginTop,
        bottomTextProps
      })}
    </Svg>
  )
}

export default QRCode
