<template>
  <div>
    <Modal v-model="modal" :mask-closable="false" :closable="false" width="360">
      <div slot="header">
        <Spin size="large">
          <Icon type="load-c" size=18


                                            class="demo-spin-icon-load"
                style="line-height: 2rem;border-radius: 20px"></Icon>
          <!--<div style="font-size: 1rem;color: #000">{{runMessage}}</div>-->

        </Spin>
      </div>
      <div style="font-size: 1rem;color: #000;text-align: center">{{runMessage}}</div>
      <div slot="footer" style="font-size: 1rem">
        <Button size="large" type="error" long v-if="!isRunning" @click="cancelTest">取消回测</Button>
        <!--<Button size="large" type="error" long @click="cancelTest">取消回测</Button>-->
      </div>
    </Modal>
    <!--取消智能回测-->
    <Modal v-model="geneticWaitingModal" :mask-closable="false" :closable="false" width="360">
      <div slot="header">
        <Spin size="large">
          <Icon type="load-c" size=18


                                            class="demo-spin-icon-load"
                style="line-height: 2rem;border-radius: 20px"></Icon>
          <!--<div style="font-size: 1rem;color: #000">{{runMessage}}</div>-->

        </Spin>
      </div>
      <div style="font-size: 1rem;color: #000;text-align: center">正在为您获取计算资源，请耐心等待...</div>
      <div slot="footer" style="font-size: 1rem">
        <Button size="large" type="error" long @click="cancelGeneticTest">取消智能回测</Button>
        <!--<Button size="large" type="error" long @click="cancelTest">取消回测</Button>-->
      </div>
    </Modal>
    <!--提示扣点操作-->
    <Modal :mask-closable="false" :closable="false" v-model="modalRedPoint"
           title="提示"
           @on-cancel="cancelRedPoint"
           @on-ok="redPoint"
           width="500">
      <p style="font-size: 1rem">您还没有















        <router-link to="/personalInfo/buycard" style="font-weight: bold;">购买</router-link>
        此次回测区间的回测卡,您将消费<span style="color: #ff0000;font-weight: bold">{{needPoints}}</span>点数来完成本次回测,是否继续?















      </p>
      <!--<p>您没有<router-link to="/buycard">购买</router-link>此回测区间的回测卡,且您的点数已不足,是否继续?</p>-->
    </Modal>
    <Modal v-model="modalNoPoint" :mask-closable="false" width="500">
      <div slot="header">
        提示
















      </div>
      <p style="font-size: 1rem;">您没有本次回测区间的回测卡，请















        <router-link to="/personalInfo/buycard">购买回测卡</router-link>
      <p style="font-size: 1rem;">本次回测需要<span style="color: #ff0000;font-weight: bold">{{needPoints}}</span>点数，您的点数已不足，请















        <router-link to="/personalInfo/recharge">充值</router-link>
      </p>
      <div slot="footer" style="font-size: 1rem">
      </div>
    </Modal>
    <Modal :mask-closable="false" v-model="geneticModal"
           width="600">
      <p slot="header" style="text-align:center">
        <span>请选择智能回测等级</span>
      </p>
      <Row type="flex" justify="center" style="font-size: 0.875rem;text-align: center;color: #ff0000">
        <i-col span="10">
          <el-radio-group v-model="geneticLevel" @change="changeGeneticLevel">
            <Badge :count="primaryTimes">
              <el-radio-button label="0">初级</el-radio-button>
            </Badge>
            <Badge :count="intermediateTimes">
              <el-radio-button label="1">中级</el-radio-button>
            </Badge>
            <Badge :count="advancedTimes">
              <el-radio-button label="2">高级</el-radio-button>
            </Badge>
          </el-radio-group>
        </i-col>
        <i-col span="20" style="text-align: center">
          <p v-html="geneticMessage"></p>
        </i-col>
      </Row>
      <div slot="footer">
        <Button type="primary" size="large" :loading="geneticLoading" :disabled="geneticPointInsuff"
                @click="okGeneticTest">确定















        </Button>
      </div>
    </Modal>
    <transition name="el-zoom-in-top">
      <Row type="flex" justify="start" :gutter="16" v-show="myModelModal" style="width: 100%">
        <i-col span="24" style="padding: .5rem;border-radius: 10px;background-color: #495060;margin-bottom:.5rem">
          <indicator-list :secondaryScreenOnlyOnce="secondaryScreenOnlyOnce"></indicator-list>
        </i-col>
        <i-col span="24" style="background: #2C3E50;padding:.5rem;border-radius:10px;margin-bottom:.5rem">
          <i-form ref="formValidate" :label-width="200" :model="formValidate" inline>
            <Row type="flex" justify="start" style="background:#fff;margin-bottom:1rem;border-radius:10px">
              <i-col span="21" style="border-right:1px solid">
                <Row type="flex" justify="center" style="border-bottom:1px solid;height:2rem">
                  <i-col span="8">
                    <Radio-group v-model="$store.state.andOrNot" @on-change="changeAndOrNot">
                      <Radio label="and" :disabled="isOneA">并且</Radio>
                      <Radio label="or" :disabled="isOneA">或者</Radio>
                      <Radio label="not" :disabled="isOneA">依次剔除掉</Radio>
                      <Radio label="customize" :disabled="isOneA">自定义</Radio>
                    </Radio-group>
                    <Poptip placement="right">
                      <Icon type="information-circled" :size="25" style="cursor: pointer"></Icon>
                      <div class="api" slot="content" style="font-size:0.875rem;">
                        <p>此处用于处理多个入市、出市或风控指标的组合关系；</p>
                        ABC 并且: 满足A 并且 满足B 并且满足C；
                        <br> ABC 或者: 满足A 或者 满足B 或者 满足C；
                                        <br> ABC依次剔除掉: 满足A 同时不能满足B 同时不能满足C；
                                        <br>若选择“自定义”，则下方的指标组合编辑区域允许进行更复杂的设定，可填入“(”、“)”、“&”、“|”、“$”；
                                        <br>其中左右括号均为英文括号，后三种符号依次表示“并且”、“或者”、“剔除掉”的意思；
                                        <br>入市、出市和风控是分开处理的；
                                        <br>二次筛选指标不介入该与或非组合计算。















                      </div>
                    </Poptip>
                  </i-col>
                </Row>
                <ul class="selected-indexs"
                    style="width: 100%;height: 25rem;overflow: auto;font-size:0.875rem;padding:.5rem;color:#34495e">
                  <li v-for="(item,indexs) in $store.state.selectedIndexs" :key="item"
                      :style="item.className === ''?style_ABC[item.selectModelClass]:style_ABC[item.className.substring(0,1)]">
                    <Tooltip v-if="item.selectModelClass === 'intoMarket'" :content="'入市'+item.number" placement="top">
                      <span>{{item.modelName}}</span>
                    </Tooltip>
                    <Tooltip v-else-if="item.selectModelClass === 'outMarket'" :content="'出市'+item.number"
                             placement="top">
                      <span>{{item.modelName}}</span>
                    </Tooltip>
                    <Tooltip v-else :content="'风控'+item.number" placement="left">
                      <span>{{item.modelName}}</span>
                    </Tooltip>
                    <Poptip placement="right" v-if="!item.className">
                      <Button shape="circle" icon="help" size="small" style="background-color: #55595c;color: #fff"
                              @click="getIndexInfo(indexs)"></Button>
                      <div class="api" slot="content" style="font-size:0.8rem">
                        <ul>
                          <li v-for="(info,index) in modelInfo" :key="index">{{info}}</li>
                        </ul>
                      </div>
                    </Poptip>
                    <!-- {{$route.path}} -->
                    <span style="float: left">
                      <Tooltip v-if="item.className.indexOf('A')!==-1" :content="'入市'+item.className" placement="top">
                    <p v-if="item.className !== ''" style="width: 31rem;text-align: right">
                      {{item.message}}</p>
                    </Tooltip>
                    <Tooltip v-else-if="item.className.indexOf('sell')!==-1"
                             :content="'出市'+item.className.replace('sell','A')" placement="top">
                      <p v-if="item.className !== ''" style="width: 31rem;text-align: right">
                        {{item.message}}</p>
                    </Tooltip>
                    <Tooltip v-else :content="item.className" placement="top">
                      <p v-if="item.className !== ''" style="width: 31rem;text-align: right">
                        {{item.message}}</p>
                    </Tooltip>
                    </span>
                    <Form-item v-for="(select,index) in item.selects"
                               :prop="'selectedIndexs.'+indexs+'.selects.'+index+'.value'" :label-width="5"
                               :key="select" style="float: left;margin: 0">
                      <el-tooltip :content="select.label" :enterable="false" placement="left">
                        <i-select v-model="select.value" filterable style="width:15rem">
                          <i-option v-for="option in select.optionList" :value="option.value" :key="option">
                            {{ option.label }}








                          </i-option>
                        </i-select>
                      </el-tooltip>
                      <Button v-if="!select.locked" size="small" icon="ios-unlocked-outline"
                              @click="lockPara(indexs,index,'selects')"></Button>
                      <Button v-else size="small" icon="locked" @click="unlockPara(indexs,index,'selects')"></Button>

                    </Form-item>
                    <Form-item v-for="(param,index) in item.params"
                               :prop="'selectedIndexs.'+indexs+'.params.'+index+'.value'" :label-width="5"
                               :rules="param.validator" :key="param" style="float: left;margin: 0;font-size:1rem"
                               :show-message="param.showMessage">
                      <el-tooltip :content="param.label" :enterable="false" placement="left">
                        <i-input type="text" v-model="param.value"
                                 style="width: 5rem;padding: 0;text-align: center;"
                                 @on-blur="getParentIndex(indexs,index)">
                          <!--<i-select size="small" v-model="select33" slot="append" style="width: 3rem">-->
                          <!--<i-option value="0">锁</i-option>-->
                          <!--<i-option value="1">不锁</i-option>-->
                          <!--</i-select>-->
                          <Button v-if="!param.locked" slot="append" type="primary" size="small"
                                  icon="ios-unlocked-outline"
                                  @click="lockPara(indexs,index,'params')"></Button>
                          <Button v-else slot="append" size="small" icon="locked"
                                  @click="unlockPara(indexs,index,'params')"></Button>
                        </i-input>
                      </el-tooltip>
                    </Form-item>
                    <Form-item v-for="(select_1,index) in item.select1"
                               :prop="'selectedIndexs.'+indexs+'.select1.'+index+'.value'" :label-width="5"
                               :rules="select_1.validator" :key="select_1" :show-message="select_1.showMessage"
                               style="float: left;margin: 0">
                      <i-select v-model="select_1.value" style="width:5rem"
                                @on-change="getSelectIndex(select_1.value,indexs)">
                        <i-option v-for="option1 in select_1.optionList" :value="option1.value" :key="option1">
                          {{ option1.label }}







                        </i-option>
                      </i-select>
                    </Form-item>
                    <Form-item v-for="(param_2,index) in item.params2"
                               :prop="'selectedIndexs.'+indexs+'.params2.'+index+'.value'" :label-width="5"
                               :rules="param_2.validator" :key="param_2" :show-message="param_2.showMessage"
                               style="float: left;margin: 0">
                      <el-tooltip :content="param_2.label" :enterable="false" placement="left">
                        <i-input type="text" v-model="param_2.value"
                                 style="width: 5rem;padding: 0;text-align: center"
                                 @on-blur="getParentIndex(indexs,index)">
                          <Button v-if="!param_2.locked" slot="append" type="primary" size="small"
                                  icon="ios-unlocked-outline"
                                  @click="lockPara(indexs,index,'params2')"></Button>
                          <Button v-else slot="append" size="small" icon="locked"
                                  @click="unlockPara(indexs,index,'params2')"></Button>
                        </i-input>
                      </el-tooltip>
                    </Form-item>
                    <Form-item v-for="(select_2,index) in item.select2"
                               :prop="'selectedIndexs.'+indexs+'.select2.'+index+'.value'" :label-width="5"
                               :rules="select_2.validator" :key="select_2" :show-message="select_2.showMessage"
                               style="float: left;margin: 0">
                      <i-select v-model="select_2.value" style="width:5rem"
                                @on-change="getSelectIndex(select_2.value,indexs)">
                        <i-option v-for="option2 in select_2.optionList" :value="option2.value" :key="option2">
                          {{ option2.label }}



                        </i-option>
                      </i-select>
                    </Form-item>
                    <Form-item v-for="(radio, index) in item.radios" :label-width="5" :key="radio"
                               style="float: left;margin: 0;font-size:1rem">
                      <Radio-group v-model="radio.value" style="margin-left: 1rem">
                        <Radio :label="radio.value1">{{radio.label1}}</Radio>
                        <Radio :label="radio.value2">{{radio.label2}}</Radio>
                        <Radio v-if="radio.threeFlag" :label="radio.value3">{{radio.label3}}</Radio>
                      </Radio-group>
                      <Button v-if="!radio.locked" size="small" icon="ios-unlocked-outline"
                              @click="lockPara(indexs,index,'radios')"></Button>
                      <Button v-else size="small" icon="locked" @click="unlockPara(indexs,index,'radios')"></Button>
                    </Form-item>
                    <!-- <Button type="primary" shape="circle" icon="ios-search"></Button> -->
                    <Button type="text" shape="circle" size="large" style="float: right" icon="close"
                            @click="handleRemove(indexs)"></Button>
                    <el-tooltip v-if="item.className===''&&!item.locked" class="item" effect="dark"
                                content="该锁定仅用于智能回测锁定指标参数" placement="top" :enterable="false" style="float: right">
                      <el-button type="text" shape="circle" icon="my-unlock" @click="lockIndicator(indexs)"
                                 style="color: #000000"></el-button>
                    </el-tooltip>
                    <el-button v-if="item.locked" type="text" icon="my-lock3"
                               style="float: right;color: #000000" @click="unlockIndicator(indexs)"></el-button>
                  </li>
                </ul>
                <ul style="border-top: 1px solid;padding: .5rem">
                  <li v-if="intoMarketList.length" class="symbol-ship">
                    <Form-item label="入市指标及其关系：" prop="andOrNotIntoMarketLeft" :label-width="150"
                               :rules="andOrNotIntoMarketLeftValidate">
                      <i-input type="text" style="width: 3rem" v-model="formValidate.andOrNotIntoMarketLeft"
                               :disabled="!isCustomise" @on-blur="intoMarketErrorLogo"></i-input>
                    </Form-item>
                    <Form-item v-for="(intoMarket,index) in formValidate.intoMarketListTemp" :label-width="60"
                               :prop="'intoMarketListTemp.'+index+'.nextRelationship'"
                               :rules="andOrNotIntoMarketMiddleValidate"
                               :label="intoMarket.selectModelClass === 'intoMarket'?intoMarket.number:intoMarket.className"
                               :key="intoMarket">
                      <i-input v-if="index !== intoMarketList.length-1" type="text"
                               style="width: 3rem;text-align: center"
                               v-model="intoMarket.nextRelationship"
                               :disabled="!isCustomise" @on-blur="intoMarketErrorLogo"></i-input>
                    </Form-item>
                    <Form-item prop="andOrNotIntoMarketRight" :label-width=".5"
                               :rules="andOrNotIntoMarketRightValidate">
                      <i-input type="text" style="width: 3rem" v-model="formValidate.andOrNotIntoMarketRight"
                               :disabled="!isCustomise" @on-blur="intoMarketErrorLogo"></i-input>
                    </Form-item>
                    <span class="error-logo" v-if="!intoMarketCanRun">
                      自定义入市指标及其关系格式有误
                    </span>
                  </li>
                  <li v-if="outMarketList.length" class="symbol-ship">
                    <Form-item label="出市指标及其关系：" prop="andOrNotOutMarketLeft" :label-width="150"
                               :rules="andOrNotIntoMarketLeftValidate">
                      <i-input type="text" style="width: 3rem" v-model="formValidate.andOrNotOutMarketLeft"
                               :disabled="!isCustomise" @on-blur="outMarketErrorLogo"></i-input>
                    </Form-item>
                    <Form-item v-for="(outMarket,index) in formValidate.outMarketListTemp" :label-width="60"
                               :prop="'outMarketListTemp.'+index+'.nextRelationship'"
                               :rules="andOrNotIntoMarketMiddleValidate"
                               :label="outMarket.selectModelClass === 'outMarket'?outMarket.number:outMarket.className"
                               :key="outMarket">
                      <i-input v-if="index !== outMarketList.length-1" type="text" style="width: 3rem"
                               v-model="outMarket.nextRelationship"
                               :disabled="!isCustomise" @on-blur="outMarketErrorLogo"></i-input>
                    </Form-item>
                    <Form-item prop="andOrNotIntoMarketRight" :label-width=".5"
                               :rules="andOrNotIntoMarketRightValidate">
                      <i-input type="text" style="width: 3rem" v-model="formValidate.andOrNotOutMarketRight"
                               :disabled="!isCustomise" @on-blur="outMarketErrorLogo"></i-input>
                    </Form-item>
                    <span class="error-logo" v-if="!outMarketCanRun">
                      自定义出市指标及其关系格式有误
                    </span>
                  </li>
                  <li v-if="windCtrlList.length" class="symbol-ship">
                    <Form-item label="风控指标及其关系：" prop="andOrNotOutMarketLeft" :label-width="150"
                               :rules="andOrNotIntoMarketLeftValidate">
                      <i-input type="text" style="width: 3rem" v-model="formValidate.andOrNotWindCtrlLeft"
                               :disabled="!isCustomise" @on-blur="windCtrlErrorLogo"></i-input>
                    </Form-item>
                    <Form-item v-for="(windCtrl,index) in formValidate.windCtrlListTemp" :label-width="60"
                               :prop="'windCtrlListTemp.'+index+'.nextRelationship'"
                               :rules="andOrNotIntoMarketMiddleValidate"
                               :label="windCtrl.selectModelClass === 'windCtrl'?windCtrl.number:windCtrl.className"
                               :key="windCtrl">
                      <i-input v-if="index !== windCtrlList.length-1" type="text" style="width: 3rem"
                               v-model="windCtrl.nextRelationship"
                               :disabled="!isCustomise" @on-blur="windCtrlErrorLogo"></i-input>
                    </Form-item>
                    <Form-item prop="andOrNotIntoMarketRight" :label-width=".5"
                               :rules="andOrNotIntoMarketRightValidate">
                      <i-input type="text" style="width: 3rem" v-model="formValidate.andOrNotWindCtrlRight"
                               :disabled="!isCustomise" @on-blur="windCtrlErrorLogo"></i-input>
                    </Form-item>
                    <span class="error-logo" v-if="!windCtrlCanRun">
                      自定义风控指标及其关系格式有误
                    </span>
                  </li>
                  <li v-if="secondList.length" class="symbol-ship">
                    <Form-item label="二次筛选指标：" :label-width="150">
                    </Form-item>
                    <Form-item :label="secondList[0].className" prop="andOrNotOutMarketLeft" :label-width=".5">
                    </Form-item>
                  </li>
                </ul>
              </i-col>
              <i-col span="3" style="padding:.5rem">
                <Form-item :label-width="10" prop="controller.modelName" style="margin-bottom: 1rem"
                           :rules="controllerValidator.modelName">
                  <Tooltip content="模型名称,长度最大为20" placement="left">
                    <i-input v-model="$store.state.controller.modelName" placeholder="模型名称"
                             :maxlength="20"></i-input>
                  </Tooltip>
                </Form-item>
                <Form-item prop="controller.backStart" style="margin-bottom: 1rem" :label-width="10">
                  <Tooltip content="回测起点 （最早从 2006-01-04 开始）" placement="left">
                    <Date-picker v-model="$store.state.controller.backStart" :editable="false" :clearable="false"
                                 :options="startTimeOption"
                                 type="date" placeholder="回测起点,格式:2011-01-01"
                                 @on-change="changeStartDate"></Date-picker>
                  </Tooltip>
                </Form-item>
                <Form-item prop="controller.backEnd" style="margin-bottom: 1rem"
                           :label-width="10">
                  <Tooltip :content="'回测终点 （最晚到 ' +$store.state.model.endTime+' 结束）'" placement="left">
                    <Date-picker v-model="$store.state.controller.backEnd" :editable="false" :clearable="false"
                                 :options="endTimeOption"
                                 type="date"
                                 placeholder="回测终点,格式:2011-01-01" @on-change="changeEndDate"></Date-picker>
                  </Tooltip>
                </Form-item>
                <Form-item prop="controller.buyRate" style="margin-bottom: 1rem" :rules="controllerValidator.buyRate"
                           :label-width="10">
                  <Tooltip content="买入费率‱（万分之）" placement="left">
                    <i-input v-model="$store.state.controller.buyRate" placeholder="买入费率"></i-input>
                  </Tooltip>
                </Form-item>
                <Form-item prop="controller.sellRate" style="margin-bottom: 1rem" :rules="controllerValidator.sellRate"
                           :label-width="10">
                  <Tooltip content="卖出费率‱（万分之）" placement="left">
                    <i-input v-model="$store.state.controller.sellRate" placeholder="卖出费率"></i-input>
                  </Tooltip>
                </Form-item>
                <Form-item prop="controller.pressureRate" style="margin-bottom: 1rem"
                           :rules="controllerValidator.pressureRate" :label-width="10">
                  <Tooltip content="模型压力费率‱（万分之）" placement="left">
                    <i-input v-model="$store.state.controller.pressureRate" placeholder="模型压力费率"></i-input>
                  </Tooltip>
                </Form-item>
                <Form-item style="" prop="controller.maxDailyHold" style="margin-bottom: 1rem"
                           :rules="controllerValidator.maxHold" :label-width="10">
                  <Tooltip content="最大每日持有股数" placement="left">
                    <i-input v-model="$store.state.controller.maxDailyHold"
                             placeholder="最大每日持有股数"></i-input>
                  </Tooltip>
                </Form-item>
                <Form-item prop="controller.holdDate" :rules="controllerValidator.holdDate" style="margin-bottom: 1rem"
                           :label-width="10">
                  <Tooltip content="持有期" placement="left">
                    <i-input v-model="$store.state.controller.holdDate" placeholder="持有期">
                    </i-input>
                  </Tooltip>
                </Form-item>
                <Form-item prop="controller.stopProfit" :rules="controllerValidator.stopProfit"
                           style="margin-bottom: 1rem"
                           :label-width="10">
                  <Tooltip content="止盈%（百分之）" placement="left">
                    <i-input v-model="$store.state.controller.stopProfit" placeholder="止盈">
                    </i-input>
                  </Tooltip>
                </Form-item>
                <Form-item prop="controller.stopLoss" :rules="controllerValidator.stopLoss"
                           :label-width="10">
                  <Tooltip content="止损%（百分之）" placement="left">
                    <i-input v-model="$store.state.controller.stopLoss" placeholder="止损">
                    </i-input>
                  </Tooltip>
                </Form-item>
              </i-col>
            </Row>
            <Row type="flex" justify="center">
              <i-col span="8">
                <Button-group>
                  <Button type="primary" size="large" @click="switchModel">切换随机模型</Button>
                  <Button type="primary" size="large" :disabled="canReduction" @click="empty">清空已选指标</Button>
                  <Button type="primary" size="large" :disabled="canReduction" @click="indexRevert">初始化指标</Button>
                  <!--<Button type="primary" size="large" :disabled="canDetailReport" @click="detailReport">详细报告</Button>-->
                </Button-group>
              </i-col>
              <i-col span="7">
                <Form-item style="margin-bottom: .5rem">
                  <el-popover
                    ref="popover"
                    placement="bottom"
                    title="单次回测说明"
                    width="600"
                    trigger="click">
                    <div class="api" style="font-size:0.875rem">
                      <p>回测区间（回测起点与回测终点的时间差）在1年以内，既不会使用回测卡也不消费点数。</p>
                      <p>回测区间超过1年，将使用回测卡或者消费点数，只选择其中一种计费。</p>
                      <p><span style="font-weight: bold">使用回测卡说明：</span>回测区间不超过回测卡允许的时间范围。比如单次5年回测卡，回测区间不超过5年可以使用，此时将不再消费点数。
                      </p>
                      <p><span style="font-weight: bold">消费点数说明：</span>消费点数等于回测区间的上取整年数，比如回测区间是2年，则消费2个点数；回测区间是3年多且不超过4年，则消费4个点数。
                      </p>
                    </div>
                  </el-popover>
                  <Button-group>
                    <Button type="success" size="large" @click="run('formValidate')" :disabled="!canRun"
                            style="font-size:1rem">单次回测











                    </Button>
                    <Button type="success" size="large" icon="arrow-down-b" v-popover:popover
                            style="font-size:1rem;opacity: .9"></Button>
                  </Button-group>
                </Form-item>
              </i-col>
              <!--智能回测隐藏-->
              <i-col span="7">
                <Form-item style="margin-bottom: .5rem">
                  <el-popover
                    ref="popover1"
                    placement="bottom"
                    title="智能回测说明"
                    width="600"
                    trigger="click">
                    <div class="api" style="font-size:0.875rem">
                      <p>若您尚未购买回测卡，您每天都能免点数执行3次初级智能回测，该次数不会累加至第二天；</p>
                      <p>若您购买了单次回测5年卡，在回测卡有效期内，您每天都能免点数执行5次初级智能回测、1次中级智能回测，该次数不会累加至第二天；</p>
                      <p>若您购买了单次回测10年卡，在回测卡有效期内，您每天都能免点数执行10次初级智能回测、3次中级智能回测，该次数不会累加至第二天。</p>
                      <p>
                        <router-link target="_blank" to="/help/geneticdoc">更多详情>></router-link>
                      </p>
                    </div>
                  </el-popover>
                  <Button-group>
                    <Button type="success" size="large" @click="geneticTest" :disabled="!canRun" style="font-size:1rem">智能回测











                    </Button>
                    <Button type="success" size="large" icon="arrow-down-b" v-popover:popover1
                            style="font-size:1rem;opacity: .9"></Button>
                  </Button-group>
                </Form-item>
              </i-col>
            </Row>
          </i-form>
        </i-col>
      </Row>
    </transition>
  </div>

</template>
<script>
  //导入controller校验器
  import {
    holdDate_validator,
    buyRate_validator,
    sellRate_validator,
    pressureRate_validator,
    maxHold_validator,
    stopProfit_validator,
    stopLoss_validator,
    modelName_validator
  } from '../../validator/validator'
  import axios from 'axios'
  //导入指标信息
  import {createModelIndexs, MY_MODEL_INDEXS} from '../../api/indexinfo'
  //  导入生成模型信息函数
  import {
    combineIndicator,
    resolveIndicator,
    classifyIndicator,
    indicatorToDes,
    resolveLocked,
    combineLockStr,
    resolveParaLock
  } from '../../api/model'
  //  远程调用接口
  import {postRemoteReqTodo, getRemoteReqTodo, getRandomModel} from '../../api/api'
  //  import uuid from 'uuid/v1'
  import {generateUUID, loginTimeoutPrompt, jumpLogin, checkStr, isBracketBalance} from '../../api/tools'
  import IndicatorList from './IndicatorList'
  //  import $ from 'jquery'
  //  加密算法
  //  import {AES,enc} from 'crypto-js'
  export default {
//      页面渲染完，加载回测区间 需要后端返回  每天的回测区间不同
    mounted() {
      const that = this;
//          若刷新页面
      new Promise(function (resolve, reject) {
//          获取模型
        getRemoteReqTodo('/stock/mymodels', [], []).then(res => {
            let data = res.data;
            that.myModelModal = true;
            if (data['status'] === 'SUCCESS') {
              that.$store.state.myModels.splice(0, that.$store.state.myModels.length);
              that.$store.commit('GET_MYMODELS', {
                returnModel: res.data.returnModel
              });
              resolve();
            } else if (data['status'] === 'ERROR') {
              that.$message.error(data['message']);
            } else if (data['status'] === 'USER_NOT_FOUND') {
              jumpLogin(that);
            }
          }
        )
      }).then(function () {
//          获取回测的最大范围
        return new Promise(function (resolve, reject) {
          getRemoteReqTodo('/stock/gettimerange', [], []).then(res => {
            let data = res.data;
            let range = data.split('&');
            that.$store.commit('GET_TEST_RANGE', {
              startTime: range[0],
              endTime: range[1]
            });
            if (that.formValidate.selectedIndexs.length === 0) {
//            如果是创建新模型  就要初始化  回测区间  否则  就要编辑出模型的回测区间
              that.$store.commit('START_END', {
                backStart: new Date(range[1]).setMonth(new Date(range[1]).getMonth() - 6),
                backEnd: range[1]
              })
            }
            if (that.$route.query.temp_sa_build !== undefined) {
              resolve();
//              let modelId = that.$route.query.temp_sa_build.replace(/\%/g, '-');
            }

          })
        })
      }).then(function () {
//判断是否有智能回测的重建模型
        let modelId = that.$route.query.temp_sa_build.replace(/\%/g, '-');
        getRemoteReqTodo('/stock/genetic/getgeneticreport', [], []).then(res => {
          if (res.data.status === 'SUCCESS') {
            let getgeneticModel = res.data.geneticModels.filter(function (item) {
              return item.intelligentModelId === modelId;
            });
            that.$store.state.andOrNot = 'customize';
            resolveIndicator(that.$store.state.selectedIndexs, getgeneticModel[0].modelPara, that.$store.state.controller, that.formValidate);
            if (getgeneticModel[0].modelPara.indexOf('[LOCK]') !== -1) {
              resolveParaLock(getgeneticModel[0].modelPara, that.formValidate.selectedIndexs);
            }
          } else {
            that.$message.error('您的模型已不存在，重建失败，请您稍后重试');
          }
        });
      }).catch(function () {
        that.$message.error('连接异常，请您稍后重试');
      });
    },
    data() {
      let that = this;
      const validateLeftSymbol = (rule, value, callback) => {
        if (value !== '' && !/^(\(*)$/.test(value)) {
          if (this.errorLogo === 'intoMarket') {
            that.intoMarketCanRun = 0;
          } else if (this.errorLogo === 'outMarket') {
            that.outMarketCanRun = 0;
          } else if (this.errorLogo === 'windCtrl') {
            that.windCtrlCanRun = 0;
          }
          callback(new Error('请输入“(”'));
        } else {
//            判断每个指标及其关系字符串  是否合法
          let intoMarketStr = checkStr(that.formValidate.andOrNotIntoMarketLeft, that.formValidate.andOrNotIntoMarketRight, that.formValidate.intoMarketListTemp);
          let outMarketStr = checkStr(that.formValidate.andOrNotOutMarketLeft, that.formValidate.andOrNotOutMarketRight, that.formValidate.outMarketListTemp);
          let windCtrlStr = checkStr(that.formValidate.andOrNotWindCtrlLeft, that.formValidate.andOrNotWindCtrlRight, that.formValidate.windCtrlListTemp);
          if (!isBracketBalance(intoMarketStr)) {
            that.intoMarketCanRun = 0;
          } else if (!isBracketBalance(outMarketStr)) {
            that.outMarketCanRun = 0;
          } else if (!isBracketBalance(windCtrlStr)) {
            that.windCtrlCanRun = 0;
          } else {
            that.intoMarketCanRun = 1;
            that.outMarketCanRun = 1;
            that.windCtrlCanRun = 1;
          }
          callback();
        }
      };
      const validateMiddleSymbol = (rule, value, callback) => {
        if (value === '' || !/^(\)*)(\&|\||\$)(\(*)$/.test(value)) {
          if (this.errorLogo === 'intoMarket') {
            that.intoMarketCanRun = 0;
          } else if (this.errorLogo === 'outMarket') {
            that.outMarketCanRun = 0;
          } else if (this.errorLogo === 'windCtrl') {
            that.windCtrlCanRun = 0;
          }
          callback(new Error('请输入“)&|$(”'));
        } else {
          let intoMarketStr = checkStr(that.formValidate.andOrNotIntoMarketLeft, that.formValidate.andOrNotIntoMarketRight, that.formValidate.intoMarketListTemp);
          let outMarketStr = checkStr(that.formValidate.andOrNotOutMarketLeft, that.formValidate.andOrNotOutMarketRight, that.formValidate.outMarketListTemp);
          let windCtrlStr = checkStr(that.formValidate.andOrNotWindCtrlLeft, that.formValidate.andOrNotWindCtrlRight, that.formValidate.windCtrlListTemp);
          if (!isBracketBalance(intoMarketStr)) {
            that.intoMarketCanRun = 0;
          } else if (!isBracketBalance(outMarketStr)) {
            that.outMarketCanRun = 0;
          } else if (!isBracketBalance(windCtrlStr)) {
            that.windCtrlCanRun = 0;
          } else {
            that.intoMarketCanRun = 1;
            that.outMarketCanRun = 1;
            that.windCtrlCanRun = 1;
          }
          callback();
        }
      };
      const validateRightSymbol = (rule, value, callback) => {
        if (value !== '' && !/^(\)*)$/.test(value)) {
          if (this.errorLogo === 'intoMarket') {
            that.intoMarketCanRun = 0;
          } else if (this.errorLogo === 'outMarket') {
            that.outMarketCanRun = 0;
          } else if (this.errorLogo === 'windCtrl') {
            that.windCtrlCanRun = 0;
          }
          callback(new Error('请输入“)”'));
        } else {
          let intoMarketStr = checkStr(that.formValidate.andOrNotIntoMarketLeft, that.formValidate.andOrNotIntoMarketRight, that.formValidate.intoMarketListTemp);
          let outMarketStr = checkStr(that.formValidate.andOrNotOutMarketLeft, that.formValidate.andOrNotOutMarketRight, that.formValidate.outMarketListTemp);
          let windCtrlStr = checkStr(that.formValidate.andOrNotWindCtrlLeft, that.formValidate.andOrNotWindCtrlRight, that.formValidate.windCtrlListTemp);
          if (!isBracketBalance(intoMarketStr)) {
            that.intoMarketCanRun = 0;
          } else if (!isBracketBalance(outMarketStr)) {
            that.outMarketCanRun = 0;
          } else if (!isBracketBalance(windCtrlStr)) {
            that.windCtrlCanRun = 0;
          } else {
            that.intoMarketCanRun = 1;
            that.outMarketCanRun = 1;
            that.windCtrlCanRun = 1;
          }
          callback();
        }
      };
      return {
        select33: '0',
        geneticWaitingModal: false,
        geneticMessage: '',
        primaryTimes: 1,
        intermediateTimes: 0,
        advancedTimes: 0,
        geneticPointInsuff: false,
        geneticLoading: false,
        errorLogo: '',
        intoMarketCanRun: 1,
        outMarketCanRun: 1,
        windCtrlCanRun: 1,
        activeName: '1-1',
        modalNoPoint: false,
        needPoints: '',
        geneticSetTime: '',
        geneticModal: false,
        geneticLevel: 0,
        loopTime: '',
        modelIndex: '',
        selectModelClass: 'intoMarket',
        myModelModal: false,
        runPoll: '',
        runMessage: '',
        startTimeOption: {
          disabledDate(date) {
            return date && (date.valueOf() < new Date(that.$store.state.model.startTime) - 86400000);
          }
        },
        endTimeOption: {
          disabledDate(date) {
            return date && date.valueOf() > new Date(that.$store.state.model.endTime);
          }
        },
        style_ABC: {
//            出市样式
          's': {
            'margin-bottom': '1rem',
            'text-align': 'center',
            'line-height': '2.2rem',
            'background-color': '#e2f0e4',
            'border-radius': '5px'
          },
//          入市样式
          'A': {
            'margin-bottom': '1rem',
            'text-align': 'center',
            'line-height': '2.2rem',
            'background-color': '#c9e5f5',
            'border-radius': '5px'
          },
          'intoMarket': {
            'margin-bottom': '1rem',
            'text-align': 'center',
            'line-height': '2.2rem',
            'background-color': '#c9e5f5',
            'border-radius': '5px'
          },
          'outMarket': {
            'margin-bottom': '1rem',
            'text-align': 'center',
            'line-height': '2.2rem',
            'background-color': '#e2f0e4',
            'border-radius': '5px'
          },
//          二次筛选样式#F7BA29
          'B': {
            'margin-bottom': '1rem',
            'text-align': 'center',
            'line-height': '2.2rem',
            'background-color': 'rgba(247,186,41,.1)',
            'border-radius': '5px'
          },
//          风控样式
          'C': {
            'margin-bottom': '1rem',
            'text-align': 'center',
            'line-height': '2.2rem',
            'background-color': 'rgba(255,73,73,.1)',
            'border-radius': '5px'
          },
          'windCtrl': {
            'margin-bottom': '1rem',
            'text-align': 'center',
            'line-height': '2.2rem',
            'background-color': 'rgba(255,73,73,.1)',
            'border-radius': '5px'
          }
        },
        modelInfo: [],
        modelId: '',
        myModels: this.$store.state.myModels,
        myModelsLen: this.$store.state.myModels.length,
        parentIndex: 0,
        selectValue: 100000,
        queryIndexInit: '',
        indicators: MY_MODEL_INDEXS,
        indexs: createModelIndexs,
        modal: false,
        runParam: '',
        isGetRunStatus: '',
        isRunning: false,
        formItem: {
          // radio: this.controller.backTest
        },
        andOrNot: this.$store.state.andOrNot,
        andOrNotSymbolIntoMarket: '&',
        andOrNotIntoMarketLeft: '',
        andOrNotIntoMarketLeftValidate: [{
          validator: validateLeftSymbol, trigger: 'blur'
        }],
        andOrNotIntoMarketMiddleValidate: [{
          validator: validateMiddleSymbol, trigger: 'blur'
        }],
        andOrNotIntoMarketRightValidate: [{
          validator: validateRightSymbol, trigger: 'blur'
        }],
        andOrNotSymbolOutMarket: '&',
        andOrNotSymbolWindCtrl: '&',

        loading: false,
        modalRedPoint: false,
        formValidate: {
          intoMarketListTemp: [],
          outMarketListTemp: [],
          windCtrlListTemp: [],
          secondListTemp: [],
          andOrNotIntoMarketLeft: this.$store.state.symbol.andOrNotIntoMarketLeft,
          andOrNotIntoMarketRight: this.$store.state.symbol.andOrNotIntoMarketRight,
          andOrNotOutMarketLeft: this.$store.state.symbol.andOrNotOutMarketLeft,
          andOrNotOutMarketRight: this.$store.state.symbol.andOrNotOutMarketRight,
          andOrNotWindCtrlLeft: this.$store.state.symbol.andOrNotWindCtrlLeft,
          andOrNotWindCtrlRight: this.$store.state.symbol.andOrNotWindCtrlRight,
          currentInputIndex: this.$store.state.currentInputIndex,
          //          仅仅是选股指标
          selectedIndexs: this.$store.state.selectedIndexs,
          controller: this.$store.state.controller,
        },
        controllerValidator: {
          holdDate: [{
            validator: holdDate_validator,
            trigger: 'blur'
          }],
          buyRate: [{
            validator: buyRate_validator,
            trigger: 'blur'
          }],
          sellRate: [{
            validator: sellRate_validator,
            trigger: 'blur'
          }],
          pressureRate: [{
            validator: pressureRate_validator,
            trigger: 'blur'
          }],
          maxHold: [{
            validator: maxHold_validator,
            trigger: 'blur'
          }],
          modelName: [{
            validator: modelName_validator,
            trigger: 'blur'
          }],
          stopProfit: [{
            validator: stopProfit_validator,
            trigger: 'blur'
          }],
          stopLoss: [{
            validator: stopLoss_validator,
            trigger: 'blur'
          }],
        }
      }
    },
    methods: {
//        输入框失去焦点时  抛出错误标志
      intoMarketErrorLogo(){
        this.errorLogo = 'intoMarket';
      },
      outMarketErrorLogo(){
        this.errorLogo = 'outMarket';
      },
      windCtrlErrorLogo(){
        this.errorLogo = 'windCtrl';
      },
      select(name){
        this.activeName = name;
      },
      selectIndex: function (indexId) {
//        触发vuex 选择指标
        this.$store.commit('SELECT_INDICATOR', {
          indicators: this.indicators,
          indicatorId: indexId,
        });

      },
//修改回测日期触发
      changeStartDate(date){
        let start = new Date(date).getTime();
        let end = new Date(this.formValidate.controller.backEnd).getTime();
        if ((end - start) / 86400000 < 30) {
          this.$message.error('回测区间最小是30天');
          this.formValidate.controller.backEnd = new Date(date).setDate(new Date(date).getDate() + 30);
        }
      },
      changeEndDate(date){
        let start = new Date(this.formValidate.controller.backStart).getTime();
        let end = new Date(date).getTime();
        if ((end - start) / 86400000 < 30) {
          this.$message.error('回测区间最小是30天');
          this.formValidate.controller.backStart = new Date(date).setDate(new Date(date).getDate() - 30);
        }
      },
//      选择出市值标
      selectIndexSell(indexId, sell){
//        标识出出市指标
        let temp = indexId.replace('A', sell);
//        触发vuex 选择指标
        this.$store.commit('SELECT_INDICATOR', {
          indicators: this.indicators,
          indicatorId: temp,
        });
      },
      run: function () {
        //          日期格式化
        const that = this;
        const hasA = that.formValidate.selectedIndexs.some(function (item) {
          return (item.className.indexOf('A') !== -1);
        });
        const hasB = that.formValidate.selectedIndexs.some(function (item) {
          return (item.className.indexOf('B') !== -1);
        });
        const hasM = that.formValidate.selectedIndexs.some(function (item) {
          return item.className === '';
        });
        if (!hasA && !hasM) {
//            如果模型数量大于1的话
          that.$message.warning('请选择选股指标或者我的模型');
        } else if (!hasB) {
          that.$message.warning('请选择二次筛选指标');
        } else {
          let modelPara = combineIndicator(that.formValidate, that.$store.state.controller);
          if (modelPara.split(/A|B|C/).length - 1 > 60) {
//                  若最后的选股指标个数超过20个，报错
            that.$message.error('您所选的指标过多，无法回测');
          } else {
            let intoMarketStr = checkStr(this.formValidate.andOrNotIntoMarketLeft, this.formValidate.andOrNotIntoMarketRight, this.formValidate.intoMarketListTemp);
            let outMarketStr = checkStr(this.formValidate.andOrNotOutMarketLeft, this.formValidate.andOrNotOutMarketRight, this.formValidate.outMarketListTemp);
            let windCtrlStr = checkStr(this.formValidate.andOrNotWindCtrlLeft, this.formValidate.andOrNotWindCtrlRight, this.formValidate.windCtrlListTemp);
            if (!isBracketBalance(intoMarketStr)) {
              this.intoMarketCanRun = 0;
            } else if (!isBracketBalance(outMarketStr)) {
              this.outMarketCanRun = 0;
            } else if (!isBracketBalance(windCtrlStr)) {
              this.windCtrlCanRun = 0;
            } else {
//              console.log(combineLockStr(that.formValidate));
              //                  判断自定义的指标之间的关系格式是否正确
              //              满足回测条件  开始回测
              that.modal = true;
//                取消回测按钮先屏蔽
              that.isRunning = true;
//                  选股指标不超过20个
              that.modelId = generateUUID();
//            请求接口获取是否能计算的状态  立即执行函数
              (function getRunStatus() {
                postRemoteReqTodo(
                  '/stock/runmodel',
                  {
                    modelId: that.modelId,
                    modelPara: modelPara,
                    modelInfo: '',
                    startTime: new Date(that.formValidate.controller.backStart).format('yyyy-MM-dd'),
                    endTime: new Date(that.formValidate.controller.backEnd).format('yyyy-MM-dd'),
                    loopType: 0,
                    useCard: 1
                  }
                ).then(response => {
                  const data = response.data;
                  if (data['status'] === 'SUCCESS') {
//                    设置正在运行的标志位
                    that.isRunning = true;
                    that.runMessage = '正在为您计算，请耐心等待...';
//                  清除timeout 避免内存泄漏
                    clearTimeout(that.isGetRunStatus);
                    that.runPoll = setTimeout(getRunResult, 2000);
                  } else if (data['status'] === 'ERROR') {
                    that.isRunning = true;
                    that.$message.error(data['message']);
                    that.modal = false;
                    that.modalRedPoint = false;
                    clearTimeout(that.isGetRunStatus);
                  } else if (data['status'] === 'ERRORYES') {
                    that.needPoints = data['needPoints'];
                    that.isRunning = true;
                    that.modal = false;
//                    只能扣点操作 弹出提示
                    that.modalRedPoint = true;
                    clearTimeout(that.isGetRunStatus);
                  } else if (data['status'] === 'ERRORNO') {
                    that.needPoints = data['needPoints'];
                    clearTimeout(that.isGetRunStatus);
                    that.isRunning = true;
                    that.modal = false;
                    that.modalNoPoint = true;
                  } else if (data['status'] === 'WAITING') {
//                        取消回测按钮在获取资源时出现
                    that.isRunning = false;
                    that.runMessage = '正在为您获取计算资源，请耐心等待...';
//                      clearTimeout(that.isGetRunStatus);
                    that.isGetRunStatus = setTimeout(getRunStatus, 2000);
                  } else if (data['status'] === 'USER_NOT_FOUND') {
//                        若session过期  跳转到登录页面
                    loginTimeoutPrompt(that);
                  }
                }).catch((response) => {
                  that.$message.error('连接异常，请您稍后再试');
                })
              })();

              function getRunResult() {
                postRemoteReqTodo('/stock/getreport',
                  {
                    modelId: that.modelId,
                    loopType: 0
                  }
                ).then(response => {
                  const data = response.data;
                  if (data['status'] === 'SUCCESS') {
                    clearTimeout(that.runPoll);
                    let report = data['report']['report'].replace(/\'/g, '\"');
                    //                  必须转换成JSON标准格式  存放在localstorage
                    that.modal = false;
                    that.$store.state.model.isRun = true;
//                  回测结果暂存在localstorage
                    localStorage.clear();
                    localStorage.setItem(that.modelId.replace(/\-/g, '%'), report);
                    that.$router.push({
                      path: '/model/singletest',
                      query: {temp_sa_asd: that.modelId.replace(/\-/g, '%')}
                    });
                  } else if (data['status'] === 'RUNNING') {
                    that.runMessage = '正在为您计算，请耐心等待...';
                    that.runPoll = setTimeout(getRunResult, 2000);
                  } else if (data['status'] === 'ERROR') {
                    that.$message.error(data['message']);
                    that.modal = false;
                    clearTimeout(that.runPoll);
                  } else if (data['status'] === 'USER_NOT_FOUND') {
                    loginTimeoutPrompt(that);
                  }
                }).catch(() => {
                  that.$message.error('连接异常，请您稍后再试');
                })
              }
            }

          }
        }

      },
//      用户取消扣点操作
      cancelRedPoint(){
        this.modalRedPoint = false;
      },
//      用户继续扣点操作
      redPoint(){
        const that = this;
        that.modalRedPoint = false;
        that.modal = true;
        let modelPara = combineIndicator(that.formValidate, that.$store.state.controller);

        (function getRunStatus() {
          postRemoteReqTodo(
            '/stock/runmodel',
            {
              modelId: that.modelId,
              modelPara: modelPara,
              modelInfo: '',
              startTime: new Date(that.formValidate.controller.backStart).format('yyyy-MM-dd'),
              endTime: new Date(that.formValidate.controller.backEnd).format('yyyy-MM-dd'),
              loopType: 0,
              useCard: 0
            }
          ).then(response => {
            const data = response.data;
            if (data['status'] === 'SUCCESS') {
//                    设置正在运行的标志位
              that.isRunning = true;
              that.runMessage = '正在为您计算，请耐心等待...';
//                  清除timeout 避免内存泄漏
              clearTimeout(that.isGetRunStatus);
              that.runPoll = setTimeout(getRunResult, 2000);
            } else if (data['status'] === 'ERROR') {
              that.modal = false;
              that.$message.error(data['message']);
              clearTimeout(that.isGetRunStatus);
            } else if (data['status'] === 'WAITING') {
              that.isRunning = false;
              that.runMessage = '正在为您获取计算资源，请耐心等待...';
              that.isGetRunStatus = setTimeout(getRunStatus, 2000);
            } else if (data['status'] === 'USER_NOT_FOUND') {
              loginTimeoutPrompt(that);
            }
          }).catch(() => {
            that.$message.error('连接异常，请您稍后再试');
          });
        })();

//        获取报告
        function getRunResult() {
          postRemoteReqTodo('/stock/getreport',
            {
              modelId: that.modelId,
              loopType: 0
            }
          ).then(response => {
            const data = response.data;
            if (data['status'] === 'SUCCESS') {
              let report = data['report']['report'].replace(/\'/g, '\"');
              clearTimeout(that.runPoll);
              //                  必须转换成JSON标准格式  存放在localstorage
              that.modal = false;
              that.$store.state.model.isRun = true;
              localStorage.clear();
              localStorage.setItem(that.modelId.replace(/\-/g, '%'), report);
              that.$router.push({path: '/model/singletest', query: {temp_sa_asd: that.modelId.replace(/\-/g, '%')}});
            } else if (data['status'] === 'ERROR') {
              that.modal = false;
              that.$message.error(data['message']);
            } else if (data['status'] === 'RUNNING') {
              that.runMessage = '正在为您计算，请耐心等待...';
              that.runPoll = setTimeout(getRunResult, 2000);
            } else if (data['status'] === 'USER_NOT_FOUND') {
              loginTimeoutPrompt(that);
            }
          }).catch(() => {
            that.$message.error('连接异常，请您稍后再试');
          })
        }

//        getRunStatus();
      },
//      正在排队时，取消智能回测  通知后端停止
      cancelGeneticTest(){
        const that = this;
        postRemoteReqTodo('/stock/genetic/cancelgeneticcalculation', {}).then(res => {
          let data = res.data;
          that.geneticWaitingModal = false;
          that.geneticLoading = false;
          clearTimeout(that.geneticSetTime);
          if (data.status === 'SUCCESS') {
            that.$message.success('您已成功取消本次智能回测');
          } else if (data.status === 'USER_NOT_FOUND') {
            jumpLogin(that);
          } else {
            that.$message.error(data.status);
          }
        })
      },
//      改变智能回测的等级时   提示给用户不同的情况
      changeGeneticLevel(level){
        const that = this;
        let modelPara = combineIndicator(that.formValidate, that.$store.state.controller);
        let startDate = this.$store.state.controller.backStart;
        let endDate = this.$store.state.controller.backEnd;
        let dateRange = ((new Date(endDate).getTime() - new Date(startDate).getTime()) / 31622400000).toFixed(1);
        let geneticLevel = [
          {name: '初级', value: 300},
          {name: '中级', value: 5000},
          {name: '高级', value: 20000}
        ];
        postRemoteReqTodo('/stock/genetic/rungeneticmodel/checkauth', {
          modelPara: modelPara,
          level: that.geneticLevel,
          loopTime: Math.ceil(geneticLevel[level].value / dateRange)
        }).then(res => {
          let data = res.data;
          let geneticName = geneticLevel[level].name;
          if (data.status === 'SUCCESS') {
//                返回免费次数
            if (Number(level) === 0) {
              that.primaryTimes = data.message;
            } else if (Number(level) === 1) {
              that.intermediateTimes = data.message;
            } else {
              that.advancedTimes = data.message;
            }
            that.geneticPointInsuff = false;
            that.geneticMessage = '您今日可免费使用' + data.message + '次' + geneticName + '智能回测';
          } else if (data.status === 'ERROR') {
//                运行出错
            that.$message.error(data.message);
          } else if (data.status === 'ERRORYES') {
//                免费次数用完  可以扣点运行
            that.geneticPointInsuff = false;
            that.geneticMessage = '本次' + geneticName + '智能回测您将会消费' + Number(data.message).toFixed(0) + '个点数';
          } else if (data.status === 'ERRORNO') {
//              免费次数用完  点数不够用
            that.geneticPointInsuff = true;
            that.geneticMessage = '本次' + geneticName + '回测需要消费' + Number(data.message).toFixed(0) + '个点数，您的点数已不足，请及时' +
              '<a href="/#/personalInfo/recharge">充值</a>或<a href="/#/personalInfo/buycard">购卡</a>';
          } else if (data.status === 'USER_NOT_FOUND') {
            jumpLogin(that);
          }
        }).catch(() => {
          that.$message.error('连接服务器异常，请您稍后重试');
        });
      },
      getGeneticTimes(){
        const that = this;
        let geneticInfo = [
          {name: '初级', value: 300},
          {name: '中级', value: 5000},
          {name: '高级', value: 20000}
        ];
        postRemoteReqTodo('/stock/genetic/rungeneticmodel/getgenetictime', {}).then(res => {
          let data = res.data;
          let status = data.status;
//          console.log(data);
          if (status === 'SUCCESS') {
            let times = data.message.split('-');
            that.primaryTimes = times[0];
            that.intermediateTimes = times[1];
            that.advancedTimes = times[2];
            that.geneticPointInsuff = false;
            that.geneticMessage = '您今日可免费使用' + times[that.geneticLevel] + '次' + geneticInfo[that.geneticLevel].name + '智能回测';
          } else if (status === 'ERROR') {
            that.$message.error(data.message);
          } else if (status === 'USER_NOT_FOUND') {
            jumpLogin(that);
          }
        }).catch(() => {
          that.$message.error('连接服务器异常，请您稍后重试');
        });
      },
      geneticTest(){
        const that = this;
        const hasA = that.formValidate.selectedIndexs.some(function (item) {
          return (item.className.indexOf('A') !== -1);
        });
        const hasB = that.formValidate.selectedIndexs.some(function (item) {
          return (item.className.indexOf('B') !== -1);
        });
        const hasM = that.formValidate.selectedIndexs.some(function (item) {
          return item.className === '';
        });
        if (!hasA && !hasM) {
//            如果模型数量大于1的话
          that.$message.warning('请选择选股指标或者我的模型');
        } else if (!hasB) {
          that.$message.warning('请选择二次筛选指标');
        } else {
          let modelPara = combineIndicator(that.formValidate, that.$store.state.controller);
          if (modelPara.split(/A|B|C/).length - 1 > 60) {
//                  若智能回测的指标个数超过20个，报错
            that.$message.error('您所选的指标过多，无法回测');
          } else {
//               填写回测次数
            let intoMarketStr = checkStr(this.formValidate.andOrNotIntoMarketLeft, this.formValidate.andOrNotIntoMarketRight, this.formValidate.intoMarketListTemp);
            let outMarketStr = checkStr(this.formValidate.andOrNotOutMarketLeft, this.formValidate.andOrNotOutMarketRight, this.formValidate.outMarketListTemp);
            let windCtrlStr = checkStr(this.formValidate.andOrNotWindCtrlLeft, this.formValidate.andOrNotWindCtrlRight, this.formValidate.windCtrlListTemp);
            if (!isBracketBalance(intoMarketStr)) {
              this.intoMarketCanRun = 0;
            } else if (!isBracketBalance(outMarketStr)) {
              this.outMarketCanRun = 0;
            } else if (!isBracketBalance(windCtrlStr)) {
              this.windCtrlCanRun = 0;
            } else {
              this.intoMarketCanRun = 1;
              this.outMarketCanRun = 1;
              this.windCtrlCanRun = 1;
              that.getGeneticTimes();
              that.geneticModal = true;
            }
          }
        }
      },
      okGeneticTest(){
//          选择好等级后  进行智能回测
        const that = this;
        that.geneticLoading = true;
        let modelPara = combineIndicator(that.formValidate, that.$store.state.controller);
        console.log(modelPara);
        let geneticLevel = [300, 5000, 20000];
        let startDate = this.$store.state.controller.backStart;
        let endDate = this.$store.state.controller.backEnd;
        let dateRange = ((new Date(endDate).getTime() - new Date(startDate).getTime()) / 31622400000).toFixed(1);
        (function geneticRun() {
          postRemoteReqTodo('/stock/genetic/rungeneticmodel', {
            modelPara: modelPara,
            level: that.geneticLevel,
            loopTime: Math.ceil(geneticLevel[that.geneticLevel] / dateRange)
          }).then(res => {
            //首先清空我的模型  再重新获取
            let data = res.data;
            that.geneticModal = false;
            that.geneticLoading = false;
            if (data.status === 'SUCCESS') {
              that.geneticWaitingModal = false;
              clearTimeout(that.geneticSetTime);
              that.$router.push('/model/genetictest');
            } else if (data.status === 'WAITING') {
              that.geneticWaitingModal = true;
//            若没有计算资源  每隔2s请求一次
              that.geneticSetTime = setTimeout(geneticRun, 2000);
            } else if (data.status === 'USER_NOT_FOUND') {
              that.geneticWaitingModal = false;
              loginTimeoutPrompt(that);
            } else {
              that.geneticWaitingModal = false;
              clearTimeout(that.geneticSetTime);
              that.$message.error(data.message);
            }
          }).catch(() => {
            clearTimeout(that.geneticSetTime);
            that.$message.error('连接服务器异常，请您稍后重试');
          });
        })();
      },
//      切换模型
      switchModel(){
        this.formValidate.andOrNotIntoMarketLeft = '';
        this.formValidate.andOrNotIntoMarketRight = '';
        this.formValidate.andOrNotOutMarketLeft = '';
        this.formValidate.andOrNotOutMarketRight = '';
        this.formValidate.andOrNotWindCtrlLeft = '';
        this.formValidate.andOrNotWindCtrlRight = '';
        getRandomModel(this.formValidate.selectedIndexs, this);
      },
      // 指标还原
      indexRevert() {
        let className;
        let value;
        let indexClass;
        const that = this;
        this.formValidate.selectedIndexs.forEach((ele, index) => {
          indexClass = '';
          if (ele.className !== '') {
            className = ele.className;
            this.$store.commit('SELECT_INDICATOR', {
              indicatorId: className,
              indicators: this.indicators
            });

          } else {
            this.$store.commit('SELECTMODEL', {
              modelIndex: ele.modelIndex,
              index: ele.modelIndex,
              selectModelClass: ele.selectModelClass,
              number: ele.number
            });
          }

        });
        this.formValidate.selectedIndexs.splice(0, this.formValidate.selectedIndexs.length / 2);
      },
//      单个删除指标
      handleRemove(index) {
        const that = this;
        let intoMarketList = this.formValidate.intoMarketListTemp.filter(function (item) {
          return item.className !== that.formValidate.selectedIndexs[index].className && item.type.indexOf('A') !== -1;
        });
        let outMarketList = this.formValidate.outMarketListTemp.filter(function (item) {
          return item.className !== that.formValidate.selectedIndexs[index].className && item.type.indexOf('sell') !== -1;
        });
        let windCtrlList = this.formValidate.windCtrlListTemp.filter(function (item) {
          return item.className !== that.formValidate.selectedIndexs[index].className && item.type.indexOf('C') !== -1;
        });
        this.formValidate.selectedIndexs.splice(index, 1);
//                console.log(intoMarketList);
        let intoMarketStr = checkStr(this.formValidate.andOrNotIntoMarketLeft, this.formValidate.andOrNotIntoMarketRight, intoMarketList);
        let outMarketStr = checkStr(this.formValidate.andOrNotOutMarketLeft, this.formValidate.andOrNotOutMarketRight, outMarketList);
        let windCtrlStr = checkStr(this.formValidate.andOrNotWindCtrlLeft, this.formValidate.andOrNotWindCtrlRight, windCtrlList);
        if (!isBracketBalance(intoMarketStr)) {
          this.intoMarketCanRun = 0;
        } else if (!isBracketBalance(outMarketStr)) {
          this.outMarketCanRun = 0;
        } else if (!isBracketBalance(windCtrlStr)) {
          this.windCtrlCanRun = 0;
        } else {
          this.intoMarketCanRun = 1;
          this.outMarketCanRun = 1;
          this.windCtrlCanRun = 1;
        }
      },
//解锁某一个指标的参数
      unlockPara(indexs, index, param){

        this.formValidate.selectedIndexs[indexs][param][index].locked = 0;
      },
//      锁定某一个参数
      lockPara(indexs, index, param){
        this.formValidate.selectedIndexs[indexs][param][index].locked = 1;
      },
//s锁定某一个指标  只限于智能回测
      lockIndicator(index){
        this.formValidate.selectedIndexs[index].locked = 1;
      },
      unlockIndicator(index){
        this.$store.state.selectedIndexs[index].locked = 0;
      },
//      获取当前指标指向  获取当前指标单个输入框指向
      getParentIndex(index, childIndex) {
        this.$store.commit('GET_CURRENT_DIRCTION', {
          parentIndex: index,
          childIndex: childIndex
        })
      },
//      获取下拉选项的指向
      getSelectIndex(value, index) {
        this.formValidate.currentInputIndex.parentIndex = index;
      },
      // 清空指标
      empty() {
//          左右两边的符号也要清除掉
        this.formValidate.andOrNotIntoMarketLeft = '';
        this.formValidate.andOrNotIntoMarketRight = '';
        this.formValidate.andOrNotOutMarketLeft = '';
        this.formValidate.andOrNotOutMarketRight = '';
        this.formValidate.andOrNotWindCtrlLeft = '';
        this.formValidate.andOrNotWindCtrlRight = '';
        this.formValidate.selectedIndexs.splice(0, this.formValidate.selectedIndexs.length);
      },
//      查看详细报告
      detailReport() {
        this.$router.push('/model/singletest');
      },
      // 选择指标是模型的情况下   添加模型
      selectModel(index) {
        this.modelIndex = index;
//        this.selectModelClass = 'intoMarket';
        this.$store.commit('SELECTMODEL', {
          modelIndex: index,
          index: index,
          number: 'MODEL' + index,
          selectModelClass: 'intoMarket'
        });
      },
//出市指标是模型的情况下
      selectModelOutMarket(index){
        this.modelIndex = index;
//        this.selectModelClass = 'outMarket';
        this.$store.commit('SELECTMODEL', {
          modelIndex: index,
          index: index,
          number: 'MODEL' + index,
          selectModelClass: 'outMarket'
        });
      },
//      风控指标选择指标是模型的情况下
      selectModelWindCtrl(index) {

        this.modelIndex = index;
//        this.selectModelClass = 'windCtrl';
        this.$store.commit('SELECTMODEL', {
          modelIndex: index,
          index: index,
          number: 'MODEL' + index,
          selectModelClass: 'windCtrl'
        });
      },

      //      模糊查询输入框操作   选择指标改变时触发函数queryIndexChange,添加指标到所选指标中
      queryIndexChange(value) {
        let indexClass;
        const that = this;
        this.indexs.price.forEach(ele => {
          if (ele.number === value) {
            indexClass = 'price-index';
          }
        });
        this.indexs.marketValue.forEach(ele => {
          if (ele.number === value) {
            indexClass = 'market-value-index';
          }
        });
        this.indexs.listingDate.forEach(ele => {
          if (ele.number === value) {
            indexClass = 'listing-date-index';
          }
        });
        this.indexs.code.forEach(ele => {
          if (ele.number === value) {
            indexClass = 'code-index';
          }
        });
        this.indexs.trade.forEach(ele => {
          if (ele.number === value) {
            indexClass = 'trade-index';
          }
        });
        this.indexs.classic.forEach(ele => {
          if (ele.number === value) {
            indexClass = 'classic-index';
          }
        });
        this.indexs.secondaryScreen.forEach(ele => {
          if (ele.number === value) {
            indexClass = 'secondary-screen';
          }
        });
        this.indexs.windControl.forEach(ele => {
          if (ele.number === value) {
            indexClass = 'wind-control';
          }
        });
        this.$store.commit('SELECTINDEXS', {

          indexClass: indexClass,
          indexId: value,
          indexs: that.indexs
        });
        //
      },
      cancelTest(){
        const that = this;
        clearTimeout(that.isGetRunStatus);
        clearTimeout(that.runPoll);
        that.modal = false;
        postRemoteReqTodo('/stock/cancelcalculation', {
          modelId: that.modelId
        }).then(res => {
          let data = res.data;
          if (data.status === 'SUCCESS') {
            that.$message.success('您已成功取消单次回测');
          } else if (data.status === 'USER_NOT_FOUND') {
            jumpLogin(that);
          } else {
            that.$message.error(data.status);
          }
        })
      },
//      获取指标信息
      getIndexInfo(index){
        const that = this;
        that.modelInfo.splice(0, that.modelInfo.length);
        let selectedIndexsTemp = [];
        let symbol = {
          andOrNotIntoMarketLeft: '',
          andOrNotIntoMarketRight: '',
          andOrNotOutMarketLeft: '',
          andOrNotOutMarketRight: '',
          andOrNotWindCtrlLeft: '',
          andOrNotWindCtrlRight: '',
        };
        let controller = {};
        resolveIndicator(selectedIndexsTemp, that.$store.state.selectedIndexs[index].modelPara, controller, symbol);
        if (that.$store.state.selectedIndexs[index].selectModelClass === 'intoMarket') {
//            只显示入市指标及其关系
//          that.modelInfo = indicatorToDes(classifyIndicator(selectedIndexsTemp, 'A', 'intoMarket'), symbol.andOrNotIntoMarketLeft, symbol.andOrNotIntoMarketRight);
          that.modelInfo = indicatorToDes.apply(this, [classifyIndicator(selectedIndexsTemp, 'A', 'intoMarket'), symbol.andOrNotIntoMarketLeft, symbol.andOrNotIntoMarketRight]);
          that.modelInfo.unshift('入市指标及其关系如下：');
        } else if (that.$store.state.selectedIndexs[index].selectModelClass === 'outMarket') {
          if (that.$store.state.selectedIndexs[index].modelPara.indexOf('[SELL]') === -1) {
            that.modelInfo = ['出市指标：无'];
          } else {
//            that.modelInfo = indicatorToDes(classifyIndicator(selectedIndexsTemp, 'sell', 'outMarket'), symbol.andOrNotOutMarketLeft, symbol.andOrNotOutMarketRight);
            that.modelInfo = indicatorToDes.call(this, classifyIndicator(selectedIndexsTemp, 'sell', 'outMarket'), symbol.andOrNotOutMarketLeft, symbol.andOrNotOutMarketRight);
            that.modelInfo.unshift('出市指标及其关系如下：');
          }
        } else {
          if (that.$store.state.selectedIndexs[index].modelPara.indexOf('[DAN_CON]') === -1) {
            that.modelInfo = ['风控指标：无'];
          } else {
            that.modelInfo = indicatorToDes(classifyIndicator(selectedIndexsTemp, 'C', 'windCtrl'), symbol.andOrNotWindCtrlLeft, symbol.andOrNotWindCtrlRight);
            that.modelInfo.unshift('风控指标及其关系如下：')
          }

        }
      },
      indexDes(){
        this.$Notice.open({
//          title: '指标说明',
          desc: '<ul style="font-size: 1rem">' +
          '<li style="margin-top: .5rem"><span style="font-weight:bold;color: #80848f">选股指标（左侧灰色）：</span><span>包括价格类指标到经典类指标，与我的模型至少要选择一个；</span></li>' +
          '<li style="margin-top: .5rem"><span style="font-weight:bold;color: #3091f2">二次筛选指标（左侧蓝色）：</span><span>您必须选择一个；</span></li>' +
          '<li style="margin-top: .5rem"><span style="font-weight:bold;color: #19be6b">风控指标（绿色）：</span><span>您可选可不选，若选择只能选择一个；</span></li>' +
          '<li style="margin-top: .5rem"><span style="font-weight:bold;color: #FF9933">我的模型（左侧橙色）：</span><span>也就是已经保存的模型，与选股指标至少选择一个。我的模型通过与或非功能，可以和其他任意选股指标或者模型自由组合。</span></li></ul>',
          duration: 0
        });
      },
      changeAndOrNot(){

      }
    },
    watch: {},
    computed: {
//        若关系是自定义  自定义关系框可以编辑    否则  不能编辑
      isCustomise(){
        return this.$store.state.andOrNot === 'customize';
      },
//        已选入市指标列表
      intoMarketList(){
        let symbol = {
          'and': '&',
          'or': '|',
          'not': '$'
        };
        let temp = this.formValidate.selectedIndexs.filter(function (item) {
          return item.className.indexOf('A') !== -1 || (item.className === '' && item.selectModelClass === 'intoMarket');
        });
        if (this.$store.state.andOrNot !== 'customize') {
          for (let i = 0; i < temp.length; i++) {
            temp[i].nextRelationship = symbol[this.$store.state.andOrNot];
          }
        } else {
//            若中间有的框框为空  则默认为and
          for (let i = 0; i < temp.length; i++) {
            if (temp[i].nextRelationship === '') {
              temp[i].nextRelationship = symbol['and'];
            }
          }
        }
        let temp1 = JSON.parse(JSON.stringify(temp));
        this.formValidate.intoMarketListTemp = temp1;
        return temp1;
      },
//      已选出市指标列表
      outMarketList(){
        let symbol = {
          'and': '&',
          'or': '|',
          'not': '$'
        };
        var temp = this.formValidate.selectedIndexs.filter(function (item) {
          return item.className.indexOf('sell') !== -1 || (item.className === '' && item.selectModelClass === 'outMarket');
        });
//        console.log(this.formValidate.selectedIndexs);
        if (this.$store.state.andOrNot !== 'customize') {
          for (let i = 0; i < temp.length; i++) {
            temp[i].nextRelationship = symbol[this.$store.state.andOrNot];
          }
        } else {
//            若中间有的框框为空  则默认为and
          for (let i = 0; i < temp.length; i++) {
            if (temp[i].nextRelationship === '') {
              temp[i].nextRelationship = symbol['and'];
            }
          }
        }
//        犯了浅拷贝和赋值的错误
        let temp1 = JSON.parse(JSON.stringify(temp));
//        实现深拷贝
        for (let i = 0; i < temp.length; i++) {
          temp1[i]['className'] = temp1[i]['className'].replace('sell', 'A');
        }
        ;
        this.formValidate.outMarketListTemp = temp1;
        return temp1;
      },
//      已选风控指标列表
      windCtrlList(){
        let symbol = {
          'and': '&',
          'or': '|',
          'not': '$'
        };
        let temp = this.formValidate.selectedIndexs.filter(function (item) {
          return item.className.indexOf('C') !== -1 || (item.className === '' && item.selectModelClass === 'windCtrl');
        });
        if (this.$store.state.andOrNot !== 'customize') {
          for (let i = 0; i < temp.length; i++) {
            temp[i].nextRelationship = symbol[this.$store.state.andOrNot];
          }
        } else {
//            若中间有的框框为空  则默认为and
          for (let i = 0; i < temp.length; i++) {
            if (temp[i].nextRelationship === '') {
              temp[i].nextRelationship = symbol['and'];
            }
          }
        }
        this.formValidate.windCtrlListTemp = temp;
        return temp;
      },
//      已选二次筛选指标列表
      secondList(){
        let temp = this.formValidate.selectedIndexs.filter(function (item) {
          return item.className.indexOf('B') !== -1;
        });
        this.formValidate.secondListTemp = temp;
        return temp;
      },

//        是否只有一个选股指标  若只有一个或者为空  禁用与或非功能
      isOneA(){
        let oneA = this.formValidate.selectedIndexs.filter(function (item) {
          return item.className.indexOf('A') !== -1;
        });
        let oneM = this.formValidate.selectedIndexs.filter(function (item) {
          return item.className === '';
        });
        if ((oneA.length + oneM.length) === 0 || (oneA.length + oneM.length) === 1) {
          return true;
        }
        return false;
      },
//      判断按钮是否可用  当校验失败时不可用
      canRun: function () {
        let canRun = 1;
        const controllerCanRun = this.$store.state.controller.sellRateCanRun * this.$store.state.controller.buyRateCanRun *
          this.$store.state.controller.holdDateCanRun * this.$store.state.controller.pressureRateCanRun * this.$store.state.controller.maxHoldCanRun *
          this.$store.state.controller.modelNameCanRun * this.$store.state.controller.stopProfitCanRun * this.$store.state.controller.stopLossCanRun * this.intoMarketCanRun * this.outMarketCanRun * this.windCtrlCanRun;
        if (this.formValidate.selectedIndexs.length === 0) {
          return canRun * controllerCanRun;
        } else {
          for (let i = 0; i < this.formValidate.selectedIndexs.length; i++) {
            for (let j = 0; j < this.formValidate.selectedIndexs[i].params.length; j++) {
              canRun = canRun * this.formValidate.selectedIndexs[i].params[j].canRun;
            }
          }
          return canRun * controllerCanRun;

        }

      },
//      目前二次筛选指标只能选一个
      secondaryScreenOnlyOnce: function () {
        return this.formValidate.selectedIndexs.some(function (item) {
          return item.className.indexOf('B') !== -1;
        })
      },
//      目前风控指标只能选一个
      windControlOnlyOnce() {
        return this.formValidate.selectedIndexs.some(function (item) {
          return item.className.indexOf('C') !== -1;
        })
      },
      canReduction: function () {
        return !this.$store.state.selectedIndexs.length;
      },
      canDetailReport: function () {
        return this.$store.state.runResultIsEmpty(this.$store.state.model.report);
      },
      routerPath() {
        return this.$router.path;
      },
      queryIndexs() {
        let temp = [];
        //          把所有的指标  类名和名字存入要查询的数组
        this.indexs.price.forEach(ele => {
          temp.push({
            value: ele.number,
            label: ele.message
          })
        });
        this.indexs.marketValue.forEach(ele => {
          temp.push({
            value: ele.number,
            label: ele.message
          })
        });
        this.indexs.listingDate.forEach(ele => {
          temp.push({
            value: ele.number,
            label: ele.message
          })
        });
        this.indexs.code.forEach(ele => {
          temp.push({
            value: ele.number,
            label: ele.message
          })
        });
        this.indexs.trade.forEach(ele => {
          temp.push({
            value: ele.number,
            label: ele.message
          })
        });
        this.indexs.classic.forEach(ele => {
          temp.push({
            value: ele.number,
            label: ele.message
          })
        });
        return temp;

      },

    },
    components: {
      IndicatorList
    }
  }
</script>
<style rel="stylesheet" lang="scss" scoped>
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }

  @keyframes ani-demo-spin {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
  }

  .layout-logo {
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }

  .layout-nav {
    width: 420px;
    margin: 0 auto;
  }

  .layout-assistant {
    width: 300px;
    margin: 0 auto;
    height: inherit;
  }

  .layout-content {
    height: 50rem;
    /*margin: 1rem;*/
    /*overflow: hidden;*/
    background: #fff;
    border-radius: 4px;
  }

  .layout-copy {
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }

  ul.index {
    li {
      /*font-size: 1rem;*/
      cursor: pointer; // text-align: center;
      // border-bottom: 1px solid;
      transition: 500ms;
      &:hover {
        color: #000000;
      }
    }
  }

  ul.selected-index {
    /*font-size: 1rem;*/
    div.index-name {
      width: 40%;
      text-align: right;
      /*border: 1px dashed #0f9ae0;*/
      border-right: none;
    }
    li {
      margin-top: .5rem;
    }
  }

  .demo-spin-col {
    height: 100px;
    position: relative;
    /*border: 1px solid #eee;*/
  }

  input {
    padding: 0;
  }

  .demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content {
    margin-top: -1rem;
  }

  // .ivu-tabs .ivu-tabs-content-animated {
  //     margin-top: -16px;
  // }
  .demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
    background: #fff;
    height: 15rem;
    overflow: auto;
    padding: 1rem;
    padding-bottom: 0;
  }

  .ivu-form-item-content {
    font-size: 0.875rem;
    & > .ivu-form-item-error-tip {
      padding-top: 1px;
    }
  }

  .ivu-form .ivu-form-item > .ivu-form-item-label {
    font-size: 0.875rem;
  }

  .ivu-radio-group > .ivu-radio-wrapper {
    font-size: 0.875rem;
  }

  .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-nav {
    /*width: 100%;*/
    & > .ivu-tabs-tab {
      &:nth-last-of-type(1) {
        background-color: #FF9933;
        color: #fff;
        &:hover {
          color: #2d8cf0;
        }
      }
      &:nth-last-of-type(2) {
        background-color: #19be6b;
        color: #fff;
        &:hover {
          color: #2d8cf0;
        }
      }
      &:nth-last-of-type(3) {
        background-color: #3091f2;
        color: #fff;
        &:hover {
          color: #2d8cf0;
        }
      }
      &:nth-last-of-type(n+4) {
        background-color: #80848f;
        color: #fff;
        &:hover {
          color: #2d8cf0;
        }
      }
    }
    /*#f8f8f9*/
    & > .ivu-tabs-tab-active {
      &:nth-last-of-type(1) {
        background-color: #fff;
        color: #2d8cf0;
      }
      &:nth-last-of-type(2) {
        background-color: #fff;
        color: #2d8cf0;

      }
      &:nth-last-of-type(3) {
        background-color: #fff;
        color: #2d8cf0;
      }
      &:nth-last-of-type(n+4) {
        background-color: #fff;
        color: #2d8cf0;
      }
    }

  }

  span.error-logo {
    color: #ff0000;
    font-size: 1rem;
    line-height: 2;
  }

</style>
