<template>
  <div>
    <v-container>
      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="yearMonth"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="yearMonth"
            prepend-icon="mdi-calendar"
            readonly
            v-on="on"
            hide-details
          />
        </template>
        <v-date-picker
          v-model="yearMonth"
          type="month"
          color="green"
          locale="ja-jp"
          no-title
          scrollable
        >
          <v-spacer />
          <v-btn text color="grey" @click="menu = false">キャンセル</v-btn>
          <v-btn text color="primary" @click="onSelectMonth">選択</v-btn>
        </v-date-picker>
      </v-menu>
      <v-row no-gutters v-masonry transition-duration="0.3s">
        <v-col
          v-for="(data, index) in tableData"
          :key="index"
          col="12"
          sm="2"
          md="2"
          lg="2"
          xl="2"
        >
          <v-img :src="data.imageUrl" @load="this.$redrawVueMasonry()"></v-img>

          <!--  操作列
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="mr-2" @click="onClickEdit(item)">mdi-pencil</v-icon>
          <v-icon @click="onClickDelete(item)">mdi-delete</v-icon>
        </template>
        -->

          <!-- 追加／編集ダイアログ -->
          <ItemDialog ref="itemDialog" />
          <!-- 削除ダイアログ -->
          <DeleteDialog ref="deleteDialog" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

import ItemDialog from "../components/ItemDialog.vue";
import DeleteDialog from "../components/DeleteDialog.vue";

export default {
  name: "Home",

  components: {
    ItemDialog,
    DeleteDialog,
  },

  data() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    return {
      /** 月選択メニューの状態 */
      menu: false,
      /** 検索文字 */
      search: "",
      /** 選択年月 */
      yearMonth: `${year}-${month}`,
      /** テーブルに表示させるデータ */
      tableData: [],
      collageUrl: "",
    };
  },

  computed: {
    ...mapState({
      /** 家計簿データ */
      abData: (state) => state.abData,
      /** ローディング状態 */
      loading: (state) => state.loading.fetch,
    }),

    /** テーブルのヘッダー設定 */
    tableHeaders() {
      return [
        { text: "artist", value: "artist", align: "end" },
        { text: "type", value: "type", sortable: false },
        { text: "name", value: "name", sortable: false },
        { text: "imageUrl", value: "imageUrl", sortable: false },
      ];
    },

    /** テーブルのフッター設定 */
    footerProps() {
      return { itemsPerPageText: "", itemsPerPageOptions: [] };
    },

    /** 収支総計 */
    sum() {
      return {
        income: 0,
        outgo: 0,
        categories: [],
      };
      /*
      let income = 0;
      let outgo = 0;
      const categoryOutgo = {};
      const categories = [];
      console.log(this.tableData);
      // 収支の合計とカテゴリ別の支出を計算
      for (const row of this.tableData) {
        if (row.income !== null) {
          income += row.income;
        } else {
          outgo += row.outgo;
          if (categoryOutgo[row.category]) {
            categoryOutgo[row.category] += row.outgo;
          } else {
            categoryOutgo[row.category] = row.outgo;
          }
        }
      }

      // カテゴリ別の支出を降順にソート
      const sorted = Object.entries(categoryOutgo).sort((a, b) => b[1] - a[1]);
      for (const [category, value] of sorted) {
        const percent = parseInt((value / outgo) * 100);
        categories.push([category, percent, value]);
      }

      return {
        income,
        outgo,
        categories,
      };
      */
    },
  },

  methods: {
    ...mapActions([
      /** 家計簿データを取得 */
      "fetchAbData",
    ]),

    /** 表示させるデータを更新します */
    async updateTable() {
      const yearMonth = this.yearMonth;
      const list = this.abData[yearMonth];

      if (list) {
        this.tableData = list;
      } else {
        await this.fetchAbData({ yearMonth });
        this.tableData = this.abData[yearMonth];
      }
    },

    /**
     * 数字を3桁区切りにして返します。
     * 受け取った数が null のときは null を返します。
     */
    separate(num) {
      return num !== null
        ? num.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,")
        : null;
    },
    /** 月選択ボタンがクリックされたとき */
    onSelectMonth() {
      this.$refs.menu.save(this.yearMonth);
      this.updateTable();
    },
    /** 追加ボタンがクリックされたとき */
    onClickAdd() {
      this.$refs.itemDialog.open("add");
    },
    /** 編集ボタンがクリックされたとき */
    onClickEdit(item) {
      this.$refs.itemDialog.open("edit", item);
    },
    /** 削除ボタンがクリックされたとき */
    onClickDelete(item) {
      this.$refs.deleteDialog.open(item);
    },
  },

  created() {
    this.updateTable();
  },
};
</script>

<style>
.summary {
  display: flex;
  font-size: 0.8rem;
  white-space: nowrap;
  line-height: 1.2rem;
}
</style>
