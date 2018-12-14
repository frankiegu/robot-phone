<template>
  <div>
    <div class="panel">
      <div class="panel-header">
        通话详情
        <div class="panel-header-tools">
          <Icon type="close"
                class="panel-close"></Icon>
        </div>
      </div>
      <div class="panel-body">
        <div class="task">
          <div class="task-l">
            <div class="board board-primary">
              <div class="board-header">
                客户信息
              </div>
              <div class="board-body">
                <p>姓名: 林先生</p>
                <p>看花: 13855556666</p>
              </div>
              <div class="board-header">
                通话信息
              </div>
              <div class="board-body">
                <p>任务名称: 林先生</p>
                <p>话术模板: 林先生</p>
                <p>机器坐席: 林先生</p>
                <p>呼叫时间: 林先生</p>
                <div class="nail">
                  <div class="nail-item">
                    <h3>1分24秒</h3>
                    <p>通话时长</p>
                  </div>
                  <div class="nail-item">
                    <h3>8轮</h3>
                    <p>通话时长</p>
                  </div>
                </div>
                <p>客户意向等级:
                  <ins class="keyword-item keyword-primary">A级</ins>
                </p>
                <p class="mt-20">命中关键字: 6个</p>
                <div class="keyword">
                  <ins class="keyword-item">房子</ins>
                  <ins class="keyword-item">房子</ins>
                  <ins class="keyword-item">房子</ins>
                  <ins class="keyword-item">房子</ins>
                  <ins class="keyword-item">房子</ins>
                  <ins class="keyword-item">房子</ins>
                  <ins class="keyword-item">房子</ins>
                </div>
              </div>
            </div>
          </div>
          <div class="task-r">
            <div class="board board-primary">
              <div class="board-header">
                通话记录
              </div>
              <div class="board-body">
                <div class="audio">
                  <i class="icon icon-download"></i>
                  <div class="audio-file">
                    <audio controls />
                  </div>
                </div>
                <div class="chat">
                  <ul>
                    <li>
                      <div class="chat-item chat-other">
                        <img :src="userAvtor"
                             class="chat-avtor">
                        <div class="chat-content chat-other-content">
                          Lorenm ipsum dolor sit amet,Lorenm ipsum dolor sit amet,Lorenm ipsum dolor sit amet, Lorenm ipsum dolor sit amet,Lorenm ipsum dolor sit amet,Lorenm ipsum dolor sit amet, Lorenm ipsum dolor sit amet,Lorenm ipsum dolor sit amet,Lorenm ipsum dolor sit amet,
                        </div>
                        <div class="chat-audio">
                          <i class="icon icon-horn"></i>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="chat-item chat-mine">
                        <div class="chat-audio">
                          <i class="icon icon-horn"></i>
                        </div>
                        <div class="chat-content">
                          喂，您好！
                        </div>
                        <img :src="userAvtor"
                             class="chat-avtor">
                      </div>
                    </li>
                    <li>
                      <div class="chat-item chat-other">
                        <img :src="userAvtor"
                             class="chat-avtor">
                        <div class="chat-content chat-other-content">
                          Lorenm ipsum dolor 
                        </div>
                        <div class="chat-audio">
                          <i class="icon icon-horn"></i>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="chat-item chat-mine">
                        <div class="chat-audio">
                          <i class="icon icon-horn"></i>
                        </div>
                        <div class="chat-content">
                          喂，您好！喂，您好！喂，您好！喂，您好！喂，您好！喂，您好！喂，您好！喂，您好！喂，您好！喂，您好！喂，您好！喂，您好！喂，您好！喂，您好！
                        </div>
                        <img :src="userAvtor"
                             class="chat-avtor">
                      </div>
                    </li>
                    <li>
                      <div class="chat-item chat-other">
                        <img :src="userAvtor"
                             class="chat-avtor">
                        <div class="chat-content chat-other-content">
                          Lorenm ipsum dolor sit amet,Lorenm ipsum dolor sit amet,Lorenm ipsum dolor sit amet, Lorenm ipsum dolor sit amet,Lorenm ipsum dolor sit amet,Lorenm ipsum dolor sit amet, Lorenm ipsum dolor sit amet,Lorenm ipsum dolor sit amet,Lorenm ipsum dolor sit amet,
                        </div>
                        <div class="chat-audio">
                          <i class="icon icon-horn"></i>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="chat-item chat-mine">
                        <div class="chat-audio">
                          <i class="icon icon-horn"></i>
                        </div>
                        <div class="chat-content">
                          喂，您好！
                        </div>
                        <img :src="userAvtor"
                             class="chat-avtor">
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userAvtor from '@/assets/images/avtor.jpg'

export default {
  data() {
    return {
      userAvtor
    }
  }
}
</script>
