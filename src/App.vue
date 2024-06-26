<template>
  <div class="container">
    <add-ticker @add-ticker="add" :disabled="tooManyTickersAdded" />

   <template v-if="tickers.length > 0" >
     <hr class="w-full border-t border-gray-600 my-4" />
     <div>
        <button
            v-if="page > 1"
            @click="page = page - 1"
            class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Back
        </button>
        <button
            v-if="hasNextPage"
            @click="page = page + 1"
            class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Next
        </button>
        <div>
          Filter:
          <input v-model="filter"/>
        </div>
      </div>
      <hr class="w-full border-t border-gray-600 my-4" />
      <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div
          v-for="t in paginatedTickers"
          :key="t.name"
          @click = "select(t)"
          :class="{
            'border-4': selectedTicker === t
          }"
          class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
        >
          <div class="px-4 py-5 sm:p-6 text-center">
            <dt class="text-sm font-medium text-gray-500 truncate">
              {{ t.name }} - USD
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {{ formatPrice(t.price) }}
            </dd>
          </div>
          <div class="w-full border-t border-gray-200"></div>
          <button
          @click.stop="handleDelete(t)"
            class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
          >
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="#718096"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
              ></path></svg>Delete
          </button>
        </div>
      </dl>
      <hr class="w-full border-t border-gray-600 my-4" />
    </template>

    <ticker-stat-graph
        v-if="selectedTicker"
        @reset-selected="handleResetSelectedTicketInGraph"
        :selected-ticker="selectedTicker"
        ref="tickerStatGraphComponent"
        :graph="graph" />
  </div>
</template>

<script>

// Problems
// [ ] 6. Availability of DEPENDENT DATA in the state | 6
// [ ] 2. Subscription for loading info is still remained after ticker deletion | 5
// [ ] 4. Tight coupling logic and view data - Direct requests in the component | 5
// [ ] 5. API errors handling | 5
// [ ] 3. Requests quantity | 4
// [ ] 8. localStorage is not updated after ticket removal | 4
// [ ] 1. Duplicate code in 'watch' | 3
// [ ] 9. localStorage and anonymous tabs | 3
// [ ] 7. Bad graph view in case of many prices | 2
// [ ] 10. Magic strings and numbers (URL, 5000ms timeout, localStorage key, tickets quantity) | 1

// Additional
// [x] The graph is broken if the values are the same everywhere
// [x] The graph is still selected when ticker is deleted
// [ ] When 'resize' is occurs - for some ms the graph view is still not updated(maxGraphElements is invalid), this needs to be fixed

import { subscribeToTicker, unsubscribeFromTicker } from "@/api";
import AddTicker from "@/components/AddTicker.vue";
import TickerStatGraph from "@/components/TickerStatGraph.vue";

export default {
  name: 'App',

  components: {
    TickerStatGraph,
    AddTicker,
  },

  data() {
    return {
      tickers: [],
      selectedTicker : null,
      graph: [],
      maxGraphElements: 1,
      graphElementWidth: 38,
      page: 1,
      filter: "",
    };
  },

  created() {
    const windowData = Object.fromEntries(new URL(window.location).searchParams.entries())

    const VALID_KEYS = ["filter", "page"];

    VALID_KEYS.forEach(key => {
      if (windowData[key]) {
        this[key] = windowData[key];
      }
    })

    // if (windowData.filter) {
    //   this.filter = windowData.filter;
    // }
    //
    // if (windowData.page) {
    //   this.page = Number(windowData.page)
    // }

    const tickersData = localStorage.getItem('cryptonomicon-list')

    if (tickersData) {
      this.tickers = JSON.parse(tickersData)
      this.tickers.forEach(ticker => {
        subscribeToTicker(ticker.name, (newPrice) => {
          this.updateTicker(ticker.name, newPrice)
        })
      })
    }

    setInterval(this.updateTickers, 5000)
    // the same as setInterval(() => this.updateTickers(), 5000)
    // automatic operation 'bind' TODO: investigate - why we can loose 'this' in simple js
  },

  computed: {
    tooManyTickersAdded() {
      return this.tickers.length > 4;
    },

    startIndex() {
      return (this.page - 1) * 6;
    },

    endIndex() {
      return this.page * 6;
    },

    filteredTickers() {
      return this.tickers.filter(
          ticker => ticker.name.includes(this.filter)
      );
    },

    paginatedTickers() {
      return this.filteredTickers.slice(this.startIndex, this.endIndex);
    },

    hasNextPage() {
      return this.filteredTickers.length > this.endIndex;
    },

    normalizedGraph() {
      const maxValue = Math.max(...this.graph);
      const minValue = Math.min(...this.graph);

      if (maxValue === minValue) {
        return this.graph.map(() => 50);
      }

      return this.graph.map(
          price => 5 + (((price - minValue) * 95) / (maxValue - minValue))
      )
    },

    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page
      }
    }
  },

  mounted() {
    window.addEventListener('resize', this.calculateMaxGraphElements)
  },

  beforeMount() {
    window.removeEventListener('resize', this.calculateMaxGraphElements)
  },

  methods: {

    calculateMaxGraphElements() {
      // no need to check this.$refs.tickerStatGraphComponent.graphRef, since in positive component was already
      // displayed, and it is expected this.$refs.tickerStatGraphComponent.graphRef
      // + using check can cause error because this.$refs.tickerStatGraphComponent.graphRef can be undefined
      if (!this.$refs.tickerStatGraphComponent) {
        return;
      }

      this.maxGraphElements = this.$refs.tickerStatGraphComponent.graphRef.clientWidth / this.graphElementWidth;
    },

    updateTicker(tickerName, price) {

      this.tickers
          .filter(t => t.name === tickerName)
          .forEach(t => {
            if (t === this.selectedTicker) {
              this.graph.push(price);
              if (this.graph.length > this.maxGraphElements) {
                this.graph = this.graph.slice(this.graph.length - this.maxGraphElements)
              }
            }
            t.price = price;
          });

    },

    formatPrice(price) {
      if (price === '-') {
        return price;
      }

      return price > 1 ? price.toFixed(2) : price.toPrecision(2);
    },

    async updateTickers() {
      // if (!this.tickers.length) {
      //   return;
      // }
      //
      // const exchangeData = await loadTickers(this.tickers.map(t => t.name));
      //
      // this.tickers.forEach(ticker => {
      //   const price = exchangeData[ticker.name.toUpperCase()];
      //
      //   ticker.price = price ?? "-"
      // });
    },

    add(ticker) {
      const currentTicker = {
        name: ticker,
        price: "-"
      };

      // this.tickers.push(currentTicker)
      this.tickers = [...this.tickers, currentTicker]
      this.filter = ''

      subscribeToTicker(currentTicker.name, (newPrice) => {
        this.updateTicker(currentTicker.name, newPrice)
      })
    },

    handleDelete(ticketToRemove) {
      this.tickers = this.tickers.filter(t => t !== ticketToRemove)
      if (this.selectedTicker === ticketToRemove) {
        this.selectedTicker = null
      }

      unsubscribeFromTicker(ticketToRemove.name);
    },

    select(selectedTicker) {
      this.selectedTicker = selectedTicker
      this.$nextTick().then(this.calculateMaxGraphElements)
    },

    handleResetSelectedTicketInGraph() {
      this.selectedTicker = null;
    }
  },

  watch: {
    selectedTicker() {
      this.graph = [];
    },

    tickers (newValue, oldValue) {
      // TODO: console log was not printed when tickers array was changed - why?
      console.log(newValue.length + " ? " + oldValue.length)
      //

      localStorage.setItem('cryptonomicon-list', JSON.stringify(this.tickers));
    },

    paginatedTickers() {
      if (this.paginatedTickers.length === 0 && this.page > 1) {
        this.page -= 1;
      }
    },

    filter() {
      this.page = 1
    },

    // meaning: when pageStateOptions will be updated (value) - then the method below will be reactively called
    pageStateOptions(value) {
      window.history.pushState(
          null,
          document.title,
          `${window.location.pathname}?filter=${value.filter}&page=${value.page}`)
    },

  }

}

</script>

<style src="./app.css">
</style>
