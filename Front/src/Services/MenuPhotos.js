import {useState} from "react";

// Both menu cards and popups follow the same item-number filenames.
// Prefer JPG, then try the original PNG convention before showing a placeholder.
export const getMenuPhotoCandidates = (number) => {
    const filename = String(number ?? "").trim();
    if (!filename) return [];
    const path = `/images/${encodeURIComponent(filename)}`;
    return [`${path}.jpg`, `${path}.JPG`, `${path}.png`, `${path}.PNG`];
};

export const useMenuPhoto = (number) => {
    const [failedPhotos, setFailedPhotos] = useState([]);
    const photo = getMenuPhotoCandidates(number).find(src => !failedPhotos.includes(src));
    const onPhotoError = () => {
        if (photo) setFailedPhotos(previous => [...previous, photo]);
    };
    return {photo, onPhotoError};
};
