import React, { useCallback } from "react";
import { Placemark } from "@pbe/react-yandex-maps";

const Marker = React.memo(({ marker, index, activeMarkerIndex, handleMarkerClick, handleMarkerHover, handleMarkerLeave }) => {
  const onClick = useCallback(() => handleMarkerClick(marker, index), [handleMarkerClick, marker, index]);
  const onMouseEnter = useCallback(() => handleMarkerHover(marker, index), [handleMarkerHover, marker, index]);
  const onMouseLeave = useCallback(handleMarkerLeave, [handleMarkerLeave]);

  return (
    <Placemark
      geometry={marker.coordinates}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      options={{
        iconLayout: "default#image",
        iconImageHref: "/assets/house.svg",
        iconImageSize: activeMarkerIndex === index ? [50, 55] : [40, 45],
        hintPane: activeMarkerIndex === index ? "islands#groundPane" : "islands#floatPane",
      }}
    />
  );
});

export default Marker;
