import firebase from 'firebase/app';
import { getStorage, ref} from 'firebase/storage';

const uploadFiles = async (files) => {
    if (!files || files.length === 0) {
        throw new Error('No files provided for upload');
    }

    const storage = getStorage();
    const storageRef = ref(storage);

    const imagesRef = ref(storageRef, 'images');

    const spaceFef = ref(storage, 'images/space.jpg');



};

export default uploadFiles;