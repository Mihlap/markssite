import { useEffect, useRef } from 'react';
import { clearFocusPhase } from './wheelShared';
import { useWheelExitFromCards } from './useWheelExitFromCards';
import { useWheelEnterSnap } from './useWheelEnterSnap';
import { useWheelExitToParent } from './useWheelExitToParent';
import { useWheelFromSlider } from './useWheelFromSlider';
import { useHorizontalWheelInCards } from './useHorizontalWheelInCards';

export function useCompanyHistoryWheelHandlers(props) {
    const {
        sectionRef,
        cardsFocused,
        historyListRef,
        timelineWrapperRef,
        historyHeaderRef,
        historyTagRef,
        marksGroupRef,
        titleRef,
        subtitleLineRef,
        subtitleLine1Ref,
        subtitleLine2Ref,
        backgroundRef,
        sliderRef,
        parentStartRef,
        onExitToParentTop,
        isDesktop,
        cardsFocusInProgressRef,
        exitToParentInProgressRef,
        hasScrollToCardsTriggered,
        hasScrollToHeaderTriggered,
        hasSplitTriggered,
        hasRestoreTriggered,
        textAnimationReady,
        headerIntroInProgressRef,
        returnedToSliderRef,
        headerIntroArmedRef,
        showYearsScale,
        hideYearsScale,
        hideHistoryTag,
        exitCardsFocus,
        setCardsFocused,
        showAndPlaceHistoryTag,
        horizontalOffsetRef: externalHorizontalOffsetRef,
        isModalOpen = false,
    } = props;

    const fallbackHorizontalOffsetRef = useRef(0);
    const horizontalOffsetRef = externalHorizontalOffsetRef || fallbackHorizontalOffsetRef;

    const recentlyExitedCardsRef = useRef({ active: false, anchorY: 0 });
    const vScrollYRef = useRef(0);
    const lockScrollRef = useRef(false);
    const lockYRef = useRef(0);
    const applyingRef = useRef(false);
    const vTweenRef = useRef(null);

    useEffect(() => {
        if (!cardsFocused) clearFocusPhase(sectionRef);
    }, [cardsFocused, sectionRef]);

    useWheelExitFromCards({
        sectionRef,
        cardsFocused,
        historyListRef,
        cardsFocusInProgressRef,
        horizontalOffsetRef,
        recentlyExitedCardsRef,
        exitCardsFocus,
    });

    useWheelEnterSnap({
        sectionRef,
        cardsFocused,
        historyListRef,
        timelineWrapperRef,
        historyHeaderRef,
        historyTagRef,
        marksGroupRef,
        titleRef,
        subtitleLineRef,
        subtitleLine1Ref,
        subtitleLine2Ref,
        backgroundRef,
        cardsFocusInProgressRef,
        exitToParentInProgressRef,
        hasScrollToCardsTriggered,
        hasScrollToHeaderTriggered,
        hasSplitTriggered,
        hasRestoreTriggered,
        textAnimationReady,
        headerIntroInProgressRef,
        returnedToSliderRef,
        setCardsFocused,
        showAndPlaceHistoryTag,
        hideHistoryTag,
        showYearsScale,
        hideYearsScale,
        horizontalOffsetRef,
        recentlyExitedCardsRef,
        vScrollYRef,
        lockScrollRef,
        lockYRef,
        applyingRef,
        vTweenRef,
        isDesktop,
    });

    useWheelExitToParent({
        sectionRef,
        cardsFocused,
        historyListRef,
        historyHeaderRef,
        historyTagRef,
        marksGroupRef,
        titleRef,
        subtitleLineRef,
        subtitleLine1Ref,
        subtitleLine2Ref,
        sliderRef,
        parentStartRef,
        onExitToParentTop,
        cardsFocusInProgressRef,
        exitToParentInProgressRef,
        headerIntroInProgressRef,
        textAnimationReady,
        hasSplitTriggered,
        hasRestoreTriggered,
        hasScrollToHeaderTriggered,
        returnedToSliderRef,
        headerIntroArmedRef,
        isDesktop,
    });

    useWheelFromSlider({
        isDesktop,
        sectionRef,
        cardsFocused,
        sliderRef,
        historyHeaderRef,
        returnedToSliderRef,
        cardsFocusInProgressRef,
        exitToParentInProgressRef,
        textAnimationReady,
        headerIntroInProgressRef,
        hasScrollToHeaderTriggered,
        hasSplitTriggered,
        hasRestoreTriggered,
        headerIntroArmedRef,
        marksGroupRef,
        titleRef,
        subtitleLineRef,
        subtitleLine1Ref,
        subtitleLine2Ref,
    });

    useHorizontalWheelInCards({
        sectionRef,
        cardsFocused,
        timelineWrapperRef,
        historyListRef,
        cardsFocusInProgressRef,
        horizontalOffsetRef,
        recentlyExitedCardsRef,
        exitCardsFocus,
        hideYearsScale,
        showYearsScale,
        hideHistoryTag,
        showAndPlaceHistoryTag,
        isModalOpen,
        isDesktop,
    });
}
