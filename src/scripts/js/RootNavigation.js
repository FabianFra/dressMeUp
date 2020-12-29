import * as React from 'react';

/*
 * Die Klasse bereitet das Arbeiten mit der StackNavigation vor. Es beinhaltet eine Hilfsfunktion, welche das Navigieren
 * zwischen den verschiedenen Views des Stacks erleichtert.
 *
 * Quelle: https://reactnavigation.org/docs/navigating-without-navigation-prop/
 */
export const navigationRef = React.createRef();

export function navigate(name, params) {
    navigationRef.current?.navigate(name, params);
}