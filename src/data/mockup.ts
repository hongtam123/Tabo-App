import { collection, doc, setDoc } from "firebase/firestore";
import { firebaseDB, firebaseStorage } from "../firebase";
import { IBook } from "../types/book";
import uuid from "react-native-uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const bookSample: IBook[] = [
  // {
  //   name: "Số đỏ",
  //   author: "Vũ Trọng Phụng",
  //   description:
  //     "Số đỏ là một tiểu thuyết văn học của nhà văn Vũ Trọng Phụng, đăng ở Hà Nội báo từ số 40 ngày 7 tháng 10 năm 1936 và được in thành sách lần đầu vào năm 1938. Nhiều nhân vật và câu nói trong tác phẩm đã đi vào cuộc sống đời thường và tác phẩm đã được dựng thành kịch, phim. Nhân vật chính của Số đỏ là Xuân - biệt danh là Xuân Tóc đỏ, từ chỗ là một kẻ bị coi là hạ lưu, bỗng nhảy lên tầng lớp danh giá của xã hội nhờ trào lưu Âu hóa của giới tiểu tư sản Hà Nội khi đó. Tác phẩm Số đỏ, cũng như các tác phẩm khác của Vũ Trọng Phụng đã từng bị cấm lưu hành tại Việt Nam Dân chủ Cộng hòa trước năm 1975 cũng như tại Việt Nam thống nhất từ năm 1975 cho đến năm 1986.[1]",
  //   category: "NOVEL",
  //   image:
  //     "https://cdn0.fahasa.com/media/catalog/product/s/o/so-do_vu-trong-phung_1.jpg",
  // },
];

const uploadImage = async (uri: string) => {
  // It won't upload image if image is not change
  const blob: any = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
  const avatarName = uuid.v4() as string;
  const fileRef = ref(firebaseStorage, avatarName);
  await uploadBytes(fileRef, blob);

  // We're done with the blob, close and release it
  blob.close();

  const avatarUrl = await getDownloadURL(fileRef);
  return { avatarName, avatarUrl };
};

export const createBook = async () => {
  console.log("start create book");
  const bookUpload = bookSample.map(async (book) => {
    const bookDocRef = doc(collection(firebaseDB, "books"));
    const { avatarUrl } = await uploadImage(book.img!);
    await setDoc(bookDocRef, {
      ...book,
      id: bookDocRef.id,
      views: 0,
      image: avatarUrl,
    });
  });
  await Promise.all(bookUpload);
  console.log("finish create book");
};
