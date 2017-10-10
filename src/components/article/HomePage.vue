<template>
  <div>
    <div class="layout-img">
      <!--<login></login>-->
    </div>
    <Row type="flex" justify="center" :gutter="32" class="code-row-bg">
    </Row>
    <Row type="flex" justify="center" :gutter="16" class="code-row-bg">
      <i-col span="5">
        <Card :style="cardStyle">
          <p slot="title" style="font-family: SimSun">
            <Icon type="soup-can"></Icon>
            知识库


          </p>
          <a href="#" slot="extra" @click.prevent="">

            查看更多>>
        </a>
          <ul>
            <li>
              <router-link to="/articleBody/foo/article1">上穿均线上穿均线上穿均线</router-link>
            </li>
            <li>
              <router-link to="/articleBody/foo/article2">上穿均线上穿均线上穿均线</router-link>
            </li>
            <li>
              <router-link to="/articleBody/foo/article3">上穿均线上穿均线上穿均线</router-link>
            </li>
            <li>
              <router-link to="/articleBody/foo/article4">上穿均线上穿均线上穿均线</router-link>
            </li>
            <li>
              <a>上穿均线上穿均线上穿均线</a>
            </li>
          </ul>
        </Card>
      </i-col>
      <i-col span="5">
        <Card :style="cardStyle">
          <p slot="title" style="font-family: SimSun">
            <Icon type="ios-recording"></Icon>
            量化课堂


          </p>
          <a href="#" slot="extra" @click.prevent="t">
            查看更多>>
        </a>
          <ul>
            <li><a>【量化课堂】关于量化编程</a></li>
            <li><a>【量化课堂】关于量化编程</a></li>
            <li><a>【量化课堂】关于量化编程</a></li>
            <li><a>【量化课堂】关于量化编程</a></li>
            <li><a>【量化课堂】关于量化编程</a></li>
          </ul>
        </Card>
      </i-col>
      <i-col span="5">
        <Card :style="cardStyle">
          <p slot="title" style="font-family: SimSun">
            <Icon type="android-volume-down"></Icon>
            公告


          </p>
          <a href="#" slot="extra" @click.prevent="">
            查看更多>>
        </a>
          <ul>
            <li><a>上穿均线上穿均线上穿均线</a></li>
            <li><a>上穿均线上穿均线上穿均线</a></li>
            <li><a>上穿均线上穿均线上穿均线</a></li>
            <li><a>上穿均线上穿均线上穿均线</a></li>
            <li><a>上穿均线上穿均线上穿均线</a></li>
          </ul>
        </Card>
      </i-col>
    </Row>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        cardStyle: {}
      }
    }
  }</script>
<style lang="scss" rel="stylesheet" scoped>
  ul li {
    margin-top: .5rem;
  }

  .layout-img {
    height: 40em;
    margin-bottom: 1rem;
    /*background-image: url('../../img/bg.jpeg');*/
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>
