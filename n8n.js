// ---------- Code 节点：Run Once (All Items) ----------

const output = [];

const inputItems = $input.all();   // 先拿一遍，后面需要索引

for (let idx = 0; idx < inputItems.length; idx++) {
    const item = inputItems[idx];
    const {formData, formType} = item.json.body;
    console.log("item.json", item.json.body)
    console.log("formData", formData)
    console.log("formType", formType)
    // ① 根据 formType 选择 templateIds
    let templateIds;
    if (formType === 'complaint') {
        templateIds = [
            '41da9300137fbddc1a684fca397fb1e0362902ac528e21a66a73abfe3b3783e1',
            'abd3a284f8d122ac4c233aeebdb4462f570792e21477dffad283ecabca1e2e49',
        ];
    } else if (formType === 'answer') {
        templateIds = [
            '253036470b30a42e5d587370279f9fb9780066366bc0a8bc7c248d6f87801e1d',
        ];
    } else if (formType === 'settlement') {
        templateIds = [
            '253036470b30a42e5d587370279f9fb9780066366bc0a8bc7c248d6f87801e1d',
        ];
    } else if (formType === 'demurrer') {
        templateIds = [
            '10cb4c4629c9c347a73ec78a36d64c946d7dadb295049d15c202fac7922bcbd2',
            '8a84c243aa273569f0180cb12e6b71b3da276d320180b77b8d530baba3bf323c',
            '81717929a11601a416e3bee6555416dd3466efbf42f1d9057d7589acaa178381',
        ];
    } else if (formType === 'motionToStrike') {
        templateIds = [
            'be2476066f00d3a76e4a0da8b331c1f1500a0dbe4bf0bb6eefa16f7d6e59af61',
            'b12b89cc4b830f77281b014c7e002c7b1c09efb5ebb1124520ef21462b3e70dc',
            'dff282f1306ed3fffd709c4de62acff21b6d7ee8c957c6465e55160b1d071b78',
        ];
    } else {
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
