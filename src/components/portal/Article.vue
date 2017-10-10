<template>
  <Row type="flex" justify="center" :gutter="16" class="code-row-bg" style="margin-top: 1rem">
    <i-col span="5">
      <Card :style="cardStyle">
        <p slot="title" style="font-family: SimSun">
          <Icon type="android-volume-down"></Icon>
          推荐模型

        </p>
        <a href="#" slot="extra" @click.prevent="">
          查看更多>>
      </a>
        <ul>
          <li><a href="#" target="_blank">上穿均线上穿均线上穿均线</a></li>
          <li><a href="#" target="_blank">上穿均线上穿均线上穿均线</a></li>
          <li><a href="#" target="_blank">上穿均线上穿均线上穿均线</a></li>
          <li><a href="#" target="_blank">上穿均线上穿均线上穿均线</a></li>
          <li><a href="#" target="_blank">上穿均线上穿均线上穿均线</a></li>
        </ul>
      </Card>
    </i-col>
    <i-col span="5">
      <Card :style="cardStyle">
        <p slot="title" style="font-family: SimSun">
          <Icon type="soup-can"></Icon>
          文章
        </p>
        <a href="#" slot="extra" @click.prevent="">

          查看更多>>
      </a>
        <ul>
          <li>
            <router-link to="#/">上穿均线上穿均线上穿均线</router-link>
          </li>
          <li>
            <a href="#" target="_blank">上穿均线上穿均线上穿均线</a>
          </li>
          <li>
            <a href="#" target="_blank">上穿均线上穿均线上穿均线</a>
          </li>
          <li>
            <a href="#" target="_blank">上穿均线上穿均线上穿均线</a>
          </li>
          <li>
            <a href="#" target="_blank">上穿均线上穿均线上穿均线</a>
          </li>
        </ul>
      </Card>
    </i-col>

    <i-col span="5">
      <Card :style="cardStyle">
        <p slot="title" style="font-family: SimSun">
          <Icon type="android-volume-down"></Icon>
          官方公告
        </p>
        <a href="#" slot="extra" @click.prevent="">
          查看更多>>
      </a>
        <ul>
          <li><a href="#" target="_blank">上穿均线上穿均线上穿均线</a></li>
          <li><a href="#" target="_blank">上穿均线上穿均线上穿均线</a></li>
          <li><a href="#" target="_blank">上穿均线上穿均线上穿均线</a></li>
          <li><a href="#" target="_blank">上穿均线上穿均线上穿均线</a></li>
          <li><a href="#" target="_blank">上穿均线上穿均线上穿均线</a></li>
        </ul>
      </Card>
    </i-col>
  </Row>

</template>
<script>
  export default {
    data(){
      return {
        cardStyle: {

        }
      }
    }
  }</script>
<style lang="scss" rel="stylesheet" scoped>
  ul li {
    margin-top: .5rem;
  }

  a {
    color: #8f96a9;
  }
</style>
