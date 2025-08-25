// ==UserScript==
// @name         크랙 채팅방 커스텀 스킨
// @version      1.0.0
// @description
// @match        https://crack.wrtn.ai/*
// @grant        none
// @author       뤼튼갤러리
// ==/UserScript==

(function () {
    'use strict';

    // --- 설정 키 정의 ---
    const styleId = 'custom-chat-skin-style-v4.0.2';
    const slotsKey = 'customChatSkinSlots_v4.0';
    const aiImageUrlKey = 'aiBubbleImageUrl';
    const bgImageUrlKey = 'bgImageUrl';
    const transparentUiKey = 'transparentUiKey';
    const bgSizeKey = 'bgImageSize';
    const bgPositionKey = 'bgImagePosition';
    const bgRepeatKey = 'bgImageRepeat';
    const bgImageCustomSizeKey = 'bgImageCustomSize';

    // 장식 이미지 관련 키 생성 (z-index 키 제거)
    const decoImageKeys = [];
    for (let i = 1; i <= 3; i++) {
        decoImageKeys.push(
            `decoImage${i}_enabled`, `decoImage${i}_url`, `decoImage${i}_size`,
            `decoImage${i}_posX`, `decoImage${i}_posY`
        );
    }

    // --- 프리셋 테마 정의 ---
    const presets = {
        sandstone: { // 베이지-브라운 내추럴
            myBg: '#F7F1E8',
            myText: '#3D342B',
            myItalic: '#8B7964',
            otherBg: '#EEE3D3',
            otherText: '#3D342B',
            otherItalic: '#9C8972',
            codeHeaderBg: '#2A211B',
            codeHeaderText: '#9E8F80',
            codeBg: '#332821',
            codeText: '#EDE4DA'
        },
        sakura: { // 벚꽃 느낌
            myBg: '#FFF7F9',
            myText: '#3D2C2C',
            myItalic: '#A6787C',
            otherBg: '#FFEFF3',
            otherText: '#4A3A3A',
            otherItalic: '#B88A95',
            codeHeaderBg: '#4B2E3D',
            codeHeaderText: '#EFBBCF',
            codeBg: '#5C3B47',
            codeText: '#FCE7EF'
        },
        indigoDusk: { // 인디고 석양 라이트
            myBg: '#ECEEFF',
            myText: '#23243A',
            myItalic: '#666A8B',
            otherBg: '#E2E6FF',
            otherText: '#242748',
            otherItalic: '#6E7399',
            codeHeaderBg: '#111230',
            codeHeaderText: '#7D81B0',
            codeBg: '#17183A',
            codeText: '#D7D9F5'
        }
    };

    const defaultColors = presets.sandstone;

    // --- 설정 관련 키 목록 ---
    const allSettingKeys = [
        ...Object.keys(defaultColors),
        aiImageUrlKey, bgImageUrlKey, transparentUiKey,
        bgSizeKey, bgPositionKey, bgRepeatKey, bgImageCustomSizeKey,
        ...decoImageKeys
    ];

    const injectStyle = () => {
        const existing = document.getElementById(styleId);
        if (existing) existing.remove();
        const sizeMode = localStorage.getItem(bgSizeKey) || 'cover';
        let finalBgSize;
        if (sizeMode === 'custom') {
            const customSize = localStorage.getItem(bgImageCustomSizeKey) || '100';
            finalBgSize = `${customSize}%`;
        } else {
            finalBgSize = sizeMode;
        }
        const getColor = (key) => localStorage.getItem(key) || defaultColors[key];
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          /* 말풍선 기본 스타일 */
          .message-bubble { border-radius: 12px !important; font-family: 'Noto Sans KR', sans-serif !important; line-height: 1.6; padding: 12px; }
          .message-bubble * { font-family: inherit !important; line-height: inherit !important; }
          .message-bubble.css-1ml77ec { background-color: ${getColor('myBg')} !important; }
          .message-bubble.css-1ml77ec .css-192kozn, .message-bubble.css-1ml77ec strong, .message-bubble.css-1ml77ec h1, .message-bubble.css-1ml77ec h2, .message-bubble.css-1ml77ec h3, .message-bubble.css-1ml77ec h4, .message-bubble.css-1ml77ec h5, .message-bubble.css-1ml77ec h6, .message-bubble.css-1ml77ec li, .message-bubble.css-1ml77ec blockquote, .message-bubble.css-1ml77ec th, .message-bubble.css-1ml77ec td { color: ${getColor('myText')} !important; }
          .message-bubble.css-1ml77ec em { color: ${getColor('myItalic')} !important; font-style: normal !important; }
          .message-bubble:not(.css-1ml77ec) { background-color: ${getColor('otherBg')} !important; }
          .message-bubble:not(.css-1ml77ec) .css-1dfojlr, .message-bubble:not(.css-1ml77ec) strong, .message-bubble:not(.css-1ml77ec) h1, .message-bubble:not(.css-1ml77ec) h2, .message-bubble:not(.css-1ml77ec) h3, .message-bubble:not(.css-1ml77ec) h4, .message-bubble:not(.css-1ml77ec) h5, .message-bubble:not(.css-1ml77ec) h6, .message-bubble:not(.css-1ml77ec) li, .message-bubble:not(.css-1ml77ec) blockquote, .message-bubble:not(.css-1ml77ec) th, .message-bubble:not(.css-1ml77ec) td { color: ${getColor('otherText')} !important; }
          .message-bubble:not(.css-1ml77ec) em { color: ${getColor('otherItalic')} !important; font-style: normal !important; }
          .message-bubble .css-dx1266 { background-color: ${getColor('codeHeaderBg')} !important; }
          .message-bubble .css-1whcozy { color: ${getColor('codeHeaderText')} !important; }
          .message-bubble pre[highlighter="hljs"] { background-color: ${getColor('codeBg')} !important; color: ${getColor('codeText')} !important; }

          /* AI 말풍선 이미지 */
          .message-item .css-13pmxen.ai-image-container { display: flex; align-items: center; justify-content: flex-start; height: 40px; padding-left: 10px; flex-grow: 1; }
          .ai-image-container .injected-ai-image { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 4px; opacity: 0.9; }

          /* 전체 배경 이미지 */
          div.css-1gj3hc4 {
            background-image: url('${localStorage.getItem(bgImageUrlKey) || ''}');
            background-size: ${finalBgSize};
            background-position: ${localStorage.getItem(bgPositionKey) || '50% 50%'};
            background-repeat: ${localStorage.getItem(bgRepeatKey) || 'no-repeat'};
            background-attachment: fixed;
          }

          /* 하단 UI 배경 제거 */
          html.transparent-ui-mode body, html.transparent-ui-mode .css-16aiml3 { background: transparent !important; }
          html.transparent-ui-mode .css-1ik4laa { background: none !important; border: none !important; box-shadow: none !important; }
          html.transparent-ui-mode .css-1lfvxx, html.transparent-ui-mode .css-1rgyp6u { display: none !important; }
          html.transparent-ui-mode .css-8pkwc8 { background: transparent !important; }
          html.transparent-ui-mode #character-message-list { padding-bottom: 240px !important; }
        `;
        document.head.appendChild(style);
    };

    const injectImages = () => {
      const imageUrl = localStorage.getItem(aiImageUrlKey);
      if (!imageUrl || imageUrl.trim() === '') {
          document.querySelectorAll('.ai-image-container').forEach(el => {
              el.innerHTML = '';
              el.classList.remove('ai-image-container', 'image-injected');
          });
          return;
      }
      const targets = document.querySelectorAll('.css-1d8xfdw .css-13pmxen:not(.image-injected)');
      targets.forEach(targetDiv => {
          targetDiv.classList.add('image-injected', 'ai-image-container');
          targetDiv.innerHTML = '';
          const img = document.createElement('img');
          img.src = imageUrl;
          img.className = 'injected-ai-image';
          img.onerror = () => { img.style.display = 'none'; };
          targetDiv.appendChild(img);
      });
    };

    const injectDecoImages = () => {
        for (let i = 1; i <= 3; i++) {
            if (!document.getElementById(`deco-image-${i}`)) {
                const decoDiv = document.createElement('div');
                decoDiv.id = `deco-image-${i}`;
                Object.assign(decoDiv.style, {
                    position: 'fixed',
                    top: '0', left: '0',
                    width: '100vw', height: '100vh',
                    pointerEvents: 'none',
                    backgroundRepeat: 'no-repeat',
                    display: 'none'
                });
                document.body.appendChild(decoDiv);
            }
        }
    };

    const updateDecoImagesStyle = () => {
        for (let i = 1; i <= 3; i++) {
            const decoDiv = document.getElementById(`deco-image-${i}`);
            if (!decoDiv) continue;

            const enabled = localStorage.getItem(`decoImage${i}_enabled`) === 'true';
            const url = localStorage.getItem(`decoImage${i}_url`) || '';
            const size = localStorage.getItem(`decoImage${i}_size`) || '100';
            const posX = localStorage.getItem(`decoImage${i}_posX`) || '50';
            const posY = localStorage.getItem(`decoImage${i}_posY`) || '50';
            const zIndex = '998'; // <<< 변경점: z-index를 '998'로 고정

            if (enabled && url) {
                decoDiv.style.display = 'block';
                decoDiv.style.backgroundImage = `url('${url}')`;
                decoDiv.style.backgroundSize = `${size}%`;
                decoDiv.style.backgroundPosition = `${posX}% ${posY}%`;
                decoDiv.style.zIndex = zIndex;
            } else {
                decoDiv.style.display = 'none';
            }
        }
    };

    const createSettingsPanel = () => {
        if (document.querySelector('#skinColorPanel')) return;
        const panel = document.createElement('div');
        panel.id = 'skinColorPanel';
        Object.assign(panel.style, {
            position: 'fixed', top: '80px', right: '20px', zIndex: '9999',
            background: '#fff', border: '1px solid #ccc', padding: '15px',
            borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            display: 'none', fontFamily: 'sans-serif', fontSize: '14px', width: '380px',
            maxHeight: 'calc(100vh - 100px)', overflowY: 'auto'
        });

        const createColorInputHTML = (id, label) => `
            <label>
                <span>${label}</span>
                <div class="color-input-wrapper">
                    <input type="color" id="${id}" class="color-picker">
                    <input type="text" id="${id}Hex" class="color-hex-input" maxlength="7" spellcheck="false">
                </div>
            </label>`;

        panel.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <strong style="font-size: 16px;">🎨 말풍선 스킨 설정</strong>
            <button id="closeSkinPanel" style="border:none; background:transparent; font-size:16px; cursor:pointer; padding:0;">❌</button>
          </div>
          <fieldset class="setting-group"><legend>프리셋 테마</legend><div style="display:flex; justify-content:space-around;"><button class="preset-btn" data-preset="sandstone">샌드스톤</button><button class="preset-btn" data-preset="sakura">사쿠라</button><button class="preset-btn" data-preset="indigoDusk">인디고</button></div></fieldset>
          <fieldset class="setting-group"><legend>커스텀 슬롯</legend>
            ${[1, 2, 3].map(i => `<div class="slot-row"><input type="text" class="slot-name-input" data-slot="${i}" placeholder="슬롯 ${i} 이름"><button class="slot-load" data-slot="${i}">불러오기</button><button class="slot-save" data-slot="${i}">저장</button></div>`).join('')}
          </fieldset>
          <details><summary class="summary-header">상세 색상 설정</summary>
            <fieldset class="color-group"><legend>내 말풍선</legend>${createColorInputHTML('myBg', '배경')}${createColorInputHTML('myText', '텍스트')}${createColorInputHTML('myItalic', '이탤릭체')}</fieldset>
            <fieldset class="color-group"><legend>상대 말풍선</legend>${createColorInputHTML('otherBg', '배경')}${createColorInputHTML('otherText', '텍스트')}${createColorInputHTML('otherItalic', '이탤릭체')}</fieldset>
            <fieldset class="color-group"><legend>코드 블록</legend>${createColorInputHTML('codeHeaderBg', '헤더 배경')}${createColorInputHTML('codeHeaderText', '헤더 글씨')}${createColorInputHTML('codeBg', '본문 배경')}${createColorInputHTML('codeText', '본문 글씨')}</fieldset>
            <button id="applyCustomColors" style="width: 100%; margin-top: 10px;">🎨 현재 색상 적용</button>
          </details>
          <details><summary class="summary-header">이미지 및 배경 설정</summary>
            <fieldset class="setting-group" style="border: none; padding: 10px 0 0 0;">
              <label class="input-row"><span>AI 말풍선 이미지</span><input type="text" id="${aiImageUrlKey}" placeholder="이미지 URL" class="url-input"></label>
              <label class="input-row"><span>전체 배경 이미지</span><input type="text" id="${bgImageUrlKey}" placeholder="이미지 URL" class="url-input"></label>
              <div id="bg-details-group">
                  <label class="input-row"><span>배경 크기</span>
                      <select id="bgSizeSelect" class="select-input">
                          <option value="cover">화면 채우기</option><option value="contain">이미지 전체 보기</option><option value="custom">사용자 지정 (%)</option><option value="auto">원래 크기</option><option value="100% 100%">화면에 맞게 늘리기</option>
                      </select>
                  </label>
                  <div id="bg-size-slider-container" class="input-row" style="display: none; margin-top: 5px;">
                      <span></span>
                      <div style="display: flex; align-items: center; width: 220px;"><input type="range" id="bgSizeSlider" min="10" max="200" style="width: 160px; margin: 0;"><span id="bgSizeValue" style="margin-left: 8px; font-weight: bold; width: 40px;">100%</span></div>
                  </div>
                  <div class="input-row" style="align-items: flex-start; margin-top: 8px;">
                      <span style="padding-top: 20px;">배경 위치</span>
                      <div style="display: flex; flex-direction: column; align-items: flex-end;">
                        <div id="bgPosPad" class="pos-pad" style="width: 100px; height: 60px; border: 1px solid #999; cursor: crosshair; position: relative; background-color: #f0f0f0; border-radius: 4px; overflow: hidden;"><div id="bgPosIndicator" class="pos-indicator" style="position: absolute; width: 6px; height: 6px; background: red; border-radius: 50%; transform: translate(-50%, -50%); pointer-events: none;"></div></div>
                        <span id="bgPosValue" class="pos-value" style="font-size: 11px; color: #555; margin-top: 2px;"></span>
                      </div>
                  </div>
                  <label class="input-row"><span>배경 반복</span>
                      <select id="bgRepeatSelect" class="select-input">
                          <option value="no-repeat">반복 안 함</option><option value="repeat">전체 반복</option><option value="repeat-x">가로 반복</option><option value="repeat-y">세로 반복</option>
                      </select>
                  </label>
              </div>
              <div class="input-row" style="margin-top: 10px;"><label style="cursor:pointer;"><span>하단 UI 배경 제거</span><input type="checkbox" id="transparentUiToggle"></label></div>
            </fieldset>
          </details>
          <details><summary class="summary-header">채팅방 꾸미기 (장식 이미지)</summary>
            ${[1,2,3].map(i => `
            <details class="deco-image-group" style="margin-top: 5px;">
                <summary style="font-size: 13px; font-weight: normal;">장식 이미지 ${i}</summary>
                <div class="setting-group" style="padding: 10px 5px 5px 5px;">
                  <label class="input-row"><span>사용</span><input type="checkbox" id="decoImage${i}_enabled"></label>
                  <label class="input-row"><span>이미지 URL</span><input type="text" id="decoImage${i}_url" placeholder="이미지 URL" class="url-input"></label>
                  <div class="input-row">
                      <span>크기</span>
                      <div style="display: flex; align-items: center; width: 220px;"><input type="range" id="decoImage${i}_size" min="10" max="300" style="width: 160px; margin: 0;"><span id="decoImage${i}_sizeValue" style="margin-left: 8px; font-weight: bold; width: 40px;">100%</span></div>
                  </div>
                  <div class="input-row" style="align-items: flex-start; margin-top: 8px;">
                      <span style="padding-top: 20px;">위치</span>
                      <div style="display: flex; flex-direction: column; align-items: flex-end;">
                        <div id="decoImage${i}_posPad" class="pos-pad" data-index="${i}" style="width: 100px; height: 60px; border: 1px solid #999; cursor: crosshair; position: relative; background-color: #f0f0f0; border-radius: 4px; overflow: hidden;"><div id="decoImage${i}_posIndicator" class="pos-indicator" style="position: absolute; width: 6px; height: 6px; background: blue; border-radius: 50%; transform: translate(-50%, -50%); pointer-events: none;"></div></div>
                        <span id="decoImage${i}_posValue" class="pos-value" style="font-size: 11px; color: #555; margin-top: 2px;"></span>
                      </div>
                  </div>
                  <!-- <<< 변경점: '말풍선 앞으로' 체크박스 UI 제거 -->
                </div>
            </details>
            `).join('')}
          </details>
          <button id="resetAllSettings" style="width: 100%; margin-top: 10px; background-color: #f8d7da; color: #721c24;">🚨 모든 설정 초기화</button>
          <style>
            #skinColorPanel .setting-group, #skinColorPanel details { border:1px solid #ddd; padding:10px; border-radius:4px; margin-bottom:10px; }
            #skinColorPanel legend { font-weight:bold; padding:0 5px; }
            #skinColorPanel .summary-header, #skinColorPanel .deco-image-group summary { font-weight:bold; cursor:pointer; }
            #skinColorPanel .input-row, #skinColorPanel label, #skinColorPanel .slot-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; font-size: 12px; }
            #skinColorPanel .slot-name-input { flex-grow: 1; margin-right: 5px; border: 1px solid #ccc; padding: 4px; border-radius: 4px; font-size: 12px; }
            #skinColorPanel input[type=checkbox] { margin-left: 10px; transform: scale(1.2); }
            #skinColorPanel .url-input, #skinColorPanel .select-input { width: 220px; border: 1px solid #ccc; padding: 4px; border-radius: 4px; }
            #skinColorPanel button { padding: 4px 8px; border-radius:4px; border:1px solid #ccc; background:#f0f0f0; cursor:pointer; font-size:12px; }
            #skinColorPanel .preset-btn { flex:1; margin: 0 2px; }
            #skinColorPanel #bg-details-group, .deco-image-group .setting-group { margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee; }
            #skinColorPanel .color-group { border:none; padding:5px 0; }
            #skinColorPanel .color-group legend { font-size:12px; color:#555; }
            .color-input-wrapper { display: flex; align-items: center; }
            .color-picker { width: 30px; height: 24px; padding: 0; border: 1px solid #ccc; border-radius: 4px 0 0 4px; cursor: pointer; background: none; }
            .color-hex-input { width: 70px; height: 22px; border: 1px solid #ccc; border-left: none; padding-left: 5px; font-family: monospace; font-size: 13px; text-transform: uppercase; border-radius: 0 4px 4px 0; outline: none; }
            .color-hex-input:focus { border-color: #007bff; }
          </style>
        `;
        document.body.appendChild(panel);

        const setupColorSync = () => {
            Object.keys(defaultColors).forEach(key => {
                const colorPicker = document.getElementById(key);
                const hexInput = document.getElementById(`${key}Hex`);
                colorPicker.addEventListener('input', () => { hexInput.value = colorPicker.value.toUpperCase(); });
                hexInput.addEventListener('input', () => {
                    let value = hexInput.value;
                    if (!value.startsWith('#')) value = '#' + value;
                    if (/^#[0-9A-F]{6}$/i.test(value)) colorPicker.value = value;
                });
                hexInput.addEventListener('focus', () => hexInput.select());
            });
        };

        const updatePanelValues = () => {
            allSettingKeys.forEach(key => {
                const el = document.getElementById(key);
                if (el) {
                    if (el.type === 'color') {
                        const hexInput = document.getElementById(`${el.id}Hex`);
                        const value = localStorage.getItem(key) || defaultColors[key] || '#000000';
                        el.value = value;
                        if (hexInput) hexInput.value = value.toUpperCase();
                    } else if (el.type === 'checkbox') {
                        el.checked = localStorage.getItem(key) === 'true';
                    } else if (el.type === 'range') {
                        const value = localStorage.getItem(key) || '100';
                        el.value = value;
                        const valueEl = document.getElementById(`${el.id}Value`);
                        if(valueEl) valueEl.textContent = `${value}%`;
                    } else {
                        el.value = localStorage.getItem(key) || '';
                    }
                }
            });

            document.getElementById('bgSizeSelect').value = localStorage.getItem(bgSizeKey) || 'cover';
            document.getElementById('bg-size-slider-container').style.display = (localStorage.getItem(bgSizeKey) === 'custom') ? 'flex' : 'none';
            document.getElementById('bgRepeatSelect').value = localStorage.getItem(bgRepeatKey) || 'no-repeat';

            const bgPos = (localStorage.getItem(bgPositionKey) || '50% 50%').split(' ');
            const bgX = parseFloat(bgPos[0]), bgY = parseFloat(bgPos[1]);
            const bgIndicator = document.getElementById('bgPosIndicator'), bgPad = document.getElementById('bgPosPad');
            if (bgPad) {
                const indicatorX = Math.max(0, Math.min((bgX / 100) * bgPad.offsetWidth, bgPad.offsetWidth));
                const indicatorY = Math.max(0, Math.min((bgY / 100) * bgPad.offsetHeight, bgPad.offsetHeight));
                bgIndicator.style.left = `${indicatorX}px`;
                bgIndicator.style.top = `${indicatorY}px`;
                document.getElementById('bgPosValue').textContent = `(${Math.round(bgX)}%, ${Math.round(bgY)}%)`;
            }

            for (let i = 1; i <= 3; i++) {
                 const posX = parseFloat(localStorage.getItem(`decoImage${i}_posX`) || '50');
                 const posY = parseFloat(localStorage.getItem(`decoImage${i}_posY`) || '50');
                 const indicator = document.getElementById(`decoImage${i}_posIndicator`);
                 const pad = document.getElementById(`decoImage${i}_posPad`);
                 if (pad && indicator) {
                    const indicatorX = Math.max(0, Math.min((posX / 100) * pad.offsetWidth, pad.offsetWidth));
                    const indicatorY = Math.max(0, Math.min((posY / 100) * pad.offsetHeight, pad.offsetHeight));
                    indicator.style.left = `${indicatorX}px`;
                    indicator.style.top = `${indicatorY}px`;
                    document.getElementById(`decoImage${i}_posValue`).textContent = `(${Math.round(posX)}%, ${Math.round(posY)}%)`;
                 }
            }

            const slots = JSON.parse(localStorage.getItem(slotsKey) || '{}');
            for (let i = 1; i <= 3; i++) {
                const slotData = slots[`slot${i}`];
                const nameInput = document.querySelector(`.slot-name-input[data-slot="${i}"]`);
                nameInput.value = (slotData && slotData.name) ? slotData.name : '';
                nameInput.placeholder = `슬롯 ${i} 이름`;
            }
        };

        const getCurrentSettings = () => {
            const settings = {};
            allSettingKeys.forEach(key => {
                 const el = document.getElementById(key);
                 if (el) {
                    settings[key] = el.type === 'checkbox' ? String(el.checked) : el.value;
                 } else {
                    settings[key] = localStorage.getItem(key);
                 }
            });
            settings[bgSizeKey] = document.getElementById('bgSizeSelect').value;
            settings[bgRepeatKey] = document.getElementById('bgRepeatSelect').value;
            return settings;
        };

        const applySettings = (settingsObject) => {
            Object.keys(settingsObject).forEach(key => {
                if(allSettingKeys.includes(key)){
                     localStorage.setItem(key, settingsObject[key]);
                }
            });
            applyInitialSettings();
            injectImages();
            updateDecoImagesStyle();
            updatePanelValues();
        };

        panel.querySelectorAll('.preset-btn').forEach(btn => {
            btn.onclick = () => {
                const presetColors = presets[btn.dataset.preset];
                 Object.keys(presetColors).forEach(key => {
                    localStorage.setItem(key, presetColors[key]);
                });
                injectStyle();
                updatePanelValues();
            };
        });

        panel.querySelectorAll('.slot-load').forEach(btn => {
            btn.onclick = () => {
                const slotNum = btn.dataset.slot;
                const slots = JSON.parse(localStorage.getItem(slotsKey) || '{}');
                if (slots[`slot${slotNum}`] && slots[`slot${slotNum}`].settings) {
                    applySettings(slots[`slot${slotNum}`].settings);
                    alert(`슬롯 '${slots[`slot${slotNum}`].name || slotNum}'을(를) 불러왔습니다.`);
                } else {
                    alert(`슬롯 ${slotNum}이 비어있습니다.`);
                }
            };
        });

        panel.querySelectorAll('.slot-save').forEach(btn => {
            btn.onclick = () => {
                const slotNum = btn.dataset.slot;
                const slotName = document.querySelector(`.slot-name-input[data-slot="${slotNum}"]`).value || `슬롯 ${slotNum}`;
                const slots = JSON.parse(localStorage.getItem(slotsKey) || '{}');
                slots[`slot${slotNum}`] = { name: slotName, settings: getCurrentSettings() };
                localStorage.setItem(slotsKey, JSON.stringify(slots));
                alert(`현재 설정을 '${slotName}' 이름으로 저장했습니다.`);
            };
        });

        document.getElementById('applyCustomColors').addEventListener('click', () => {
            Object.keys(defaultColors).forEach(key => {
                localStorage.setItem(key, document.getElementById(key).value);
            });
            injectStyle();
        });

        document.getElementById('resetAllSettings').addEventListener('click', () => {
            if (confirm('정말로 모든 스킨 설정을 초기화하시겠습니까? 저장된 슬롯도 모두 삭제됩니다.')) {
                allSettingKeys.forEach(key => localStorage.removeItem(key));
                localStorage.removeItem(slotsKey);
                alert('모든 설정이 초기화되었습니다. 페이지를 새로고침합니다.');
                location.reload();
            }
        });

        document.getElementById(aiImageUrlKey).addEventListener('input', (e) => { localStorage.setItem(aiImageUrlKey, e.target.value); injectImages(); });
        document.getElementById(bgImageUrlKey).addEventListener('input', (e) => { localStorage.setItem(bgImageUrlKey, e.target.value); injectStyle(); });
        document.getElementById('bgSizeSelect').addEventListener('change', (e) => {
            const mode = e.target.value;
            localStorage.setItem(bgSizeKey, mode);
            document.getElementById('bg-size-slider-container').style.display = mode === 'custom' ? 'flex' : 'none';
            injectStyle();
        });
        document.getElementById('bgSizeSlider').addEventListener('input', (e) => {
            const value = e.target.value;
            document.getElementById('bgSizeValue').textContent = `${value}%`;
            localStorage.setItem(bgImageCustomSizeKey, value);
            if (localStorage.getItem(bgSizeKey) === 'custom') injectStyle();
        });
        document.getElementById('bgRepeatSelect').addEventListener('change', (e) => { localStorage.setItem(bgRepeatKey, e.target.value); injectStyle(); });
        document.getElementById('transparentUiToggle').addEventListener('change', (e) => {
            localStorage.setItem(transparentUiKey, String(e.target.checked));
            applyInitialSettings();
        });

        let currentPad = null;
        const setPosition = (e) => {
            if (!currentPad) return;
            const rect = currentPad.getBoundingClientRect();
            const rawX = e.clientX - rect.left;
            const rawY = e.clientY - rect.top;
            const xPercent = (rawX / rect.width) * 100;
            const yPercent = (rawY / rect.height) * 100;
            const indicatorX = Math.max(0, Math.min(rawX, rect.width));
            const indicatorY = Math.max(0, Math.min(rawY, rect.height));
            const indicator = currentPad.querySelector('.pos-indicator');
            indicator.style.left = `${indicatorX}px`;
            indicator.style.top = `${indicatorY}px`;
            const valueEl = currentPad.parentElement.querySelector('.pos-value');
            valueEl.textContent = `(${Math.round(xPercent)}%, ${Math.round(yPercent)}%)`;

            if (currentPad.id === 'bgPosPad') {
                localStorage.setItem(bgPositionKey, `${xPercent.toFixed(2)}% ${yPercent.toFixed(2)}%`);
                injectStyle();
            } else {
                const index = currentPad.dataset.index;
                localStorage.setItem(`decoImage${index}_posX`, xPercent.toFixed(2));
                localStorage.setItem(`decoImage${index}_posY`, yPercent.toFixed(2));
                updateDecoImagesStyle();
            }
        };
        document.querySelectorAll('.pos-pad').forEach(pad => {
            pad.addEventListener('mousedown', (e) => { currentPad = pad; setPosition(e); });
        });
        document.addEventListener('mousemove', (e) => { if (currentPad) setPosition(e); });
        document.addEventListener('mouseup', () => { currentPad = null; });

        for (let i = 1; i <= 3; i++) {
            document.getElementById(`decoImage${i}_enabled`).addEventListener('change', e => { localStorage.setItem(`decoImage${i}_enabled`, e.target.checked); updateDecoImagesStyle(); });
            document.getElementById(`decoImage${i}_url`).addEventListener('input', e => { localStorage.setItem(`decoImage${i}_url`, e.target.value); updateDecoImagesStyle(); });
            document.getElementById(`decoImage${i}_size`).addEventListener('input', e => {
                document.getElementById(`decoImage${i}_sizeValue`).textContent = `${e.target.value}%`;
                localStorage.setItem(`decoImage${i}_size`, e.target.value);
                updateDecoImagesStyle();
            });
            // <<< 변경점: z-index 관련 이벤트 리스너 제거
        }

        document.getElementById('closeSkinPanel').onclick = () => panel.style.display = 'none';

        setupColorSync();
        updatePanelValues();
    };

    const insertToggleButton = () => {
      if (document.querySelector('#skinToggleBtn')) return;
      const interval = setInterval(() => {
          const referenceNode = document.querySelector('p:-webkit-any-link') || Array.from(document.querySelectorAll('p')).find(p => p.textContent.includes('상황 이미지 보기'));
          if (!referenceNode) return;
          const parentBlock = referenceNode.closest('.css-j7qwjs');
          if (!parentBlock || document.querySelector('#skinToggleBtn')) { clearInterval(interval); return; }
          const btn = document.createElement('button');
          btn.id = 'skinToggleBtn';
          btn.textContent = '🎨 스킨 설정';
          Object.assign(btn.style, { margin: '10px 0', padding: '6px 12px', fontSize: '14px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: '#fff', width: '100%' });
          btn.onclick = () => {
              const panel = document.getElementById('skinColorPanel');
              if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
          };
          if (parentBlock.parentNode) { parentBlock.parentNode.insertBefore(btn, parentBlock.nextSibling); clearInterval(interval); }
      }, 500);
    };

    const applyInitialSettings = () => {
        document.documentElement.classList.toggle('transparent-ui-mode', localStorage.getItem(transparentUiKey) === 'true');
        injectStyle();
    };

    const run = () => {
        applyInitialSettings();
        injectDecoImages();
        updateDecoImagesStyle();
        createSettingsPanel();
        insertToggleButton();
        setTimeout(injectImages, 200);
    };

    if (document.readyState === 'loading') { window.addEventListener('DOMContentLoaded', run); }
    else { run(); }

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(() => {
                insertToggleButton();
                applyInitialSettings();
            }, 500);
        }
        injectImages();
        if (localStorage.getItem(transparentUiKey) === 'true') {
            document.querySelectorAll('.css-1lfvxx, .css-1rgyp6u').forEach(spacer => {
                if (spacer.style.display !== 'none') {
                    spacer.style.display = 'none';
                }
            });
        }
    }).observe(document.body, { subtree: true, childList: true });

})();