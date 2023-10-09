<template>
  <div>
    <!-- <input type="file" ref="fileInput" @change="handleFileUpload" accept=".xlsx" /> -->
    <v-file-input
      color="primary"
      class="mx-5"
      clearable
      accept=".xls, .xlsx"
      label="clic para subir el archivo"
      variant="outlined"
      prepend-icon="mdi-microsoft-excel"
      v-model="fileInput"
      @change="handleFileUpload"
      ></v-file-input>
    <table>
      <thead>
        <th>correo</th>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in rows" :key="idx">
          <td>{{ row }}</td>
        </tr>
      </tbody>
      <tfoot>
        <td colspan="2">
          <button @click="exportFile">Export XLSX</button>
        </td>
      </tfoot>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { read, utils, writeFileXLSX } from "xlsx";

const rows = ref([]);
const fileInput = ref(null);

onMounted(() => {
  // You can also perform any initial setup here.
});

async function handleFileUpload() {
  const file = fileInput.value[0];
  if (file) {
    const ab = await readFileAsArrayBuffer(file);
    const wb = read(ab);
    rows.value = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
    console.log(rows.value);
  }
}

function exportFile() {
  const ws = utils.json_to_sheet(rows.value);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "Data");
  writeFileXLSX(wb, "SheetJSVueAoO.xlsx");
}

async function readFileAsArrayBuffer(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.readAsArrayBuffer(file);
  });
}
</script>
