import axios from "axios";

const url = axios.create({
  baseURL: "https://v1.nocodeapi.com/battu/google_sheets/VGhgSynYcaXTcTAg",
});

const tabId = `?tabId=Ogrenci`; 


export const fetchStudents = async () => {
  try {
    const response = await url.get(tabId);
    console.log("API'den alınan öğrenciler:", response.data);

    
    const formattedData = response.data.data.map((row) => ({
      key: row.row_id,
      name: row.name, 
      surname: row.surname , 
      student_id: row.row_id, 
      email: row.email, 
    }));
    return  formattedData ;
  } catch (error) {
    throw new Error(`Veri çekme hatası: ${error.message}`);
  }
};

export const addStudent = async (student) => {
  try {
    const data = [[student.name,student.surname,student.email,student.student_id]]; 

    console.log("Gönderilen veri:", JSON.stringify(data, null, 2));

    const response = await url.post(tabId,data);
    console.log("API yanıtı:", response.data);

    const row_id = response.data.row_id || null;
    if (!row_id) {
      const updatedStudent = await fetchStudents();
      const newStudent = updatedStudent.data.find(
        (item) =>   
        item.name === student.name &&
        item.surname === student.surname &&
        item.email === student.email &&
        item.student_id === student.student_id
      );
      return {
        row_id: newStudent.row_id,
        name: newStudent.name,
        surname: newStudent.surname,
        email: newStudent.email,
        student_id: newStudent.student_id,
        
      };
    }
    return {
      row_id,
      name: student.name,
      surname: student.surname,
      email: student.email,
      student_id: student.student_id,

    };

  } catch (error) {
    console.error("Öğrenci ekleme hatası:", error.response?.data || error.message);
    throw new Error(`Ekleme hatası: ${error.message}`);
  }
}
