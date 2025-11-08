/**
 * 联系人模型
 * 管理联系人数据的存储和操作
 */
import { v4 as uuidv4 } from 'uuid';

// 内存存储联系人数据
class ContactModel {
    constructor() {
        // 初始化一些示例数据
        this.contacts = [
            {
                id: '1',
                name: '张三',
                phone: '13800138001',
                email: 'zhangsan@example.com',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '2',
                name: '李四',
                phone: '13800138002',
                email: 'lisi@example.com',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '3',
                name: '王五',
                phone: '13800138003',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    }

    /**
     * 获取所有联系人
     * @returns {Array} 联系人列表
     */
    getAllContacts() {
        return this.contacts;
    }

    /**
     * 根据ID获取联系人
     * @param {string} id - 联系人ID
     * @returns {Object|null} 联系人对象或null
     */
    getContactById(id) {
        return this.contacts.find(contact => contact.id === id) || null;
    }

    /**
     * 创建新联系人
     * @param {Object} contactData - 联系人数据
     * @param {string} contactData.name - 姓名
     * @param {string} contactData.phone - 电话
     * @param {string} [contactData.email] - 邮箱（可选）
     * @returns {Object} 创建的联系人对象
     */
    createContact(contactData) {
        const now = new Date().toISOString();
        const newContact = {
            id: uuidv4(),
            name: contactData.name,
            phone: contactData.phone,
            email: contactData.email || null,
            createdAt: now,
            updatedAt: now
        };
        
        this.contacts.push(newContact);
        return newContact;
    }

    /**
     * 更新联系人
     * @param {string} id - 联系人ID
     * @param {Object} contactData - 更新的联系人数据
     * @returns {Object|null} 更新后的联系人对象或null
     */
    updateContact(id, contactData) {
        const index = this.contacts.findIndex(contact => contact.id === id);
        
        if (index === -1) {
            return null;
        }
        
        // 更新联系人数据
        this.contacts[index] = {
            ...this.contacts[index],
            ...contactData,
            updatedAt: new Date().toISOString()
        };
        
        return this.contacts[index];
    }

    /**
     * 删除联系人
     * @param {string} id - 联系人ID
     * @returns {boolean} 是否删除成功
     */
    deleteContact(id) {
        const initialLength = this.contacts.length;
        this.contacts = this.contacts.filter(contact => contact.id !== id);
        return this.contacts.length < initialLength;
    }

    /**
     * 搜索联系人
     * @param {string} keyword - 搜索关键词
     * @returns {Array} 匹配的联系人列表
     */
    searchContacts(keyword) {
        const lowerKeyword = keyword.toLowerCase();
        return this.contacts.filter(contact => 
            contact.name.toLowerCase().includes(lowerKeyword) ||
            contact.phone.includes(keyword) ||
            (contact.email && contact.email.toLowerCase().includes(lowerKeyword))
        );
    }

    /**
     * 检查电话号码是否已存在
     * @param {string} phone - 电话号码
     * @param {string} [excludeId] - 排除的联系人ID（用于更新时）
     * @returns {boolean} 是否存在
     */
    isPhoneExists(phone, excludeId = null) {
        return this.contacts.some(contact => 
            contact.phone === phone && contact.id !== excludeId
        );
    }
}

// 导出单例
const contactModel = new ContactModel();
export default contactModel;