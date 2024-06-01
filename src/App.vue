<template>
  <div class="article-app">
    <h2 class="title">Catatan</h2>

        <!-- Pesan jika tidak ada inputan -->
        <div v-if="showWarning" class="top-pop">
      <p>Masukkan judul dan isi artikel sebelum menyimpan.</p>
    </div>

    <form @submit.prevent="save" class="article-form">
      <input type="text" v-model="form.title" placeholder="Judul Artikel" class="input-field" />
      <textarea v-model="form.content" placeholder="Isi Artikel" class="textarea-field"></textarea>
      <button type="submit" class="save-button">{{ form.id ? 'Perbarui' : 'Simpan' }}</button>
    </form>

    <!-- Artikel yang sudah ada -->
    <div v-if="articles.length" class="article-list">
      <article v-for="article in articles" :key="article.id" class="article-card">
        <h3 class="article-title">{{ article.title }}</h3>
        <p class="article-content">{{ article.content }}</p>
        <div class="button-group">
          <button @click="edit(article)" class="edit-button">Ubah</button>
          <button @click="deleteArticle(article.id)" class="delete-button">Hapus</button>
        </div>
      </article>
    </div>
    <p v-else class="no-articles">Belum ada artikel.</p>

    <button @click="load" class="load-button">Muat/Segarkan</button>
  </div>
</template>



<script>
import { defineComponent, ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export default defineComponent({
  setup() {
  const form = reactive({
    id: null,
    title: '',
    content: ''
  });
  const articles = ref([]);
  const showWarning = ref(false); // Menambahkan variabel showWarning

  async function load() {
    try {
      const response = await axios.get('http://localhost:3000/articles');
      articles.value = response.data;
    } catch (error) {
      console.error('Error loading articles:', error);
    }
  }

  async function save() {
    try {
      if (!form.title.trim() || !form.content.trim()) {
        showWarning.value = true;
        return;
      }

      let response;
      if (form.id) {
        response = await axios.put(`http://localhost:3000/articles/${form.id}`, form);
        const updatedArticle = response.data;
        const index = articles.value.findIndex(article => article.id === updatedArticle.id);
        if (index !== -1) {
          articles.value.splice(index, 1, updatedArticle);
        }
      } else {
        form.id = uuidv4();
        response = await axios.post('http://localhost:3000/articles', form);
        articles.value.push(response.data);
      }
      form.id = null;
      form.title = '';
      form.content = '';
      showWarning.value = false;
    } catch (error) {
      console.error('Error saving article:', error);
    }
  }

  async function deleteArticle(id) {
    try {
      await axios.delete(`http://localhost:3000/articles/${id}`);
      articles.value = articles.value.filter(article => article.id !== id);
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  }

  function edit(article) {
    form.id = article.id;
    form.title = article.title;
    form.content = article.content;
  }

  onMounted(load);

  return { form, articles, save, edit, deleteArticle, showWarning };
}

});
</script>




