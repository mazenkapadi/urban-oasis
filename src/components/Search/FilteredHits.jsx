import React from "react";
import { useHits } from "react-instantsearch";

const FilteredHits = ({ hitComponent, classNames, viewMode }) => {
    const { hits } = useHits();

    // Filter out past events
    const filteredHits = hits.filter(
        (hit) =>
            hit.eventDetails?.eventDateTime &&
            new Date(hit.eventDetails.eventDateTime) >= new Date()
    );

    return (
        <div
            className={
                classNames?.list ||
                (viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col space-y-4")
            }
        >
            {filteredHits.map((hit) => (
                <div key={hit.objectID}>
                    {React.createElement(hitComponent, { hit })}
                </div>
            ))}
        </div>
    );
};

export default FilteredHits;
