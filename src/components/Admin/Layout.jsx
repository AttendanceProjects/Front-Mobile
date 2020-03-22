import React from 'react';
import { Animated } from 'react-native';


export const FadeInView = ({ children, style }) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1.35,
      duration: 800,
    }).start();

    return () => {
      Animated.timing(fadeAnim, {
        toValue: 1.35,
        duration: 800,
      }).stop();
    }
  }, [ fadeAnim ]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...style,
        opacity: fadeAnim, // Bind opacity to animated value
        transform: [{
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [500, 1]  // 0 : 150, 0.5 : 75, 1 : 0
          }),
        }],
      }}>
      {children}
    </Animated.View>
  );
};