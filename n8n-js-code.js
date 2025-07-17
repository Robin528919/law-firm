// ---------- Code 节点：Run Once (All Items) ----------

const output = [];

const inputItems = $input.all();   // 先拿一遍，后面需要索引

// 用对象映射优化 formType 到 templateIds 的判断
const templateIdMap = {
    complaint: [
        '148a187c0b746715400b503dd19dfe71df525267de463a487c9bc505be0cad71',
        'abd3a284f8d122ac4c233aeebdb4462f570792e21477dffad283ecabca1e2e49',
    ],
    answer: [
        '253036470b30a42e5d587370279f9fb9780066366bc0a8bc7c248d6f87801e1d',
    ],
    settlement: [
        '253036470b30a42e5d587370279f9fb9780066366bc0a8bc7c248d6f87801e1d',
    ],
    demurrer: [
        '10cb4c4629c9c347a73ec78a36d64c946d7dadb295049d15c202fac7922bcbd2',
        '8a84c243aa273569f0180cb12e6b71b3da276d320180b77b8d530baba3bf323c',
        '81717929a11601a416e3bee6555416dd3466efbf42f1d9057d7589acaa178381',
    ],
    motionToStrike: [
        'be2476066f00d3a76e4a0da8b331c1f1500a0dbe4bf0bb6eefa16f7d6e59af61',
        'b12b89cc4b830f77281b014c7e002c7b1c09efb5ebb1124520ef21462b3e70dc',
        'dff282f1306ed3fffd709c4de62acff21b6d7ee8c957c6465e55160b1d071b78',
    ],
    requestForProduction: [
        'b369013328ce427559638bd24f5c932a65ea008a7aa148b3347b7bac7a9c4017',
    ],
    pmpDepo: [
        '377d576604b7d807b8ec760621cfcd07ec5ca155754bfbc59feca1a3244df647',
    ],
    ntcOfDepo: [
        'c57494e428d7993f893022cfe0592a992af77a833b096a3796809821459572c4',
    ],
    rfpSexualHarassment: [
        'd6ab81f88d6158492ebfcb721ed19cffdcbcdf1e94eb13e07a9eeb92316ceea5',
    ],
    ntcOfRuling: [
        'd2a3b90ae65dd978c692712a89907ac5e8d02bd44c6a6fcf074d40017b571a5a',
    ],
    cmcNotice: [
        '22df26ddb07729500d530f8e22efc4026b515c2a8c77c22ec1608a3319d61903',
    ],
    ntcCaseReassignment: [
        '84e7781f81460320abb44c75a6e3f179ff8859f1a8cae2f6999ea92e4371e57f',
    ],
};

for (let idx = 0; idx < inputItems.length; idx++) {
    const item = inputItems[idx];
    const {formData, formType} = item.json.body;
    console.log("item.json", item.json.body)
    console.log("formData", formData)
    console.log("formType", formType)
    // ① 根据 formType 选择 templateIds
    const templateIds = templateIdMap[formType];
    if (!templateIds) {
        throw new Error(`未知的 formType: ${formType}`);
    }

    // ② 拆分成多条输出；每条附带 pairedItem
    for (const id of templateIds) {
        output.push({
            json: {
                ...item.json,     // 保留所有原字段
                templateId: id,   // 单个 id
            },
            pairedItem: {       // 告诉 n8n：它来自第 idx 条输入
                item: idx,
            },
        });
    }
}

return output;
