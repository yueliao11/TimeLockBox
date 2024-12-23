module time_capsule::capsule {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};
    use std::string::{Self, String};
    use std::vector;
    
    const ENotUnlockTime: u64 = 0;
    const EInvalidTime: u64 = 1;
    const ENotAuthorized: u64 = 2;
    const EInvalidContent: u64 = 3;

    public struct TimeCapsule has key, store {
        id: UID,
        content: String,           // 文字内容
        media_content: String,     // 媒体内容
        content_type: String,      // 内容类型: text/image/video
        unlock_time: u64,
        owner: address,
        recipient: address
    }

    public entry fun create_capsule(
        content: vector<u8>,
        media_content: vector<u8>,
        content_type: vector<u8>,
        unlock_time: u64,
        recipient: address,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // 检查解锁时间
        assert!(unlock_time > clock::timestamp_ms(clock), EInvalidTime);
        
        // 检查内容有效性 - 文字或媒体至少要有一个
        let has_content = !vector::is_empty(&content);
        let has_media = !vector::is_empty(&media_content);
        assert!(has_content || has_media, EInvalidContent);
        
        let capsule = TimeCapsule {
            id: object::new(ctx),
            content: string::utf8(content),
            media_content: string::utf8(media_content),
            content_type: string::utf8(content_type),
            unlock_time,
            owner: tx_context::sender(ctx),
            recipient
        };
        
        transfer::transfer(capsule, recipient)
    }

    // 获取胶囊文字内容
    public fun view_content(capsule: &TimeCapsule, clock: &Clock, viewer: address): String {
        assert!(clock::timestamp_ms(clock) >= capsule.unlock_time || viewer == capsule.owner, ENotUnlockTime);
        assert!(viewer == capsule.recipient || viewer == capsule.owner, ENotAuthorized);
        capsule.content
    }

    // 获取胶囊媒体内容
    public fun view_media_content(capsule: &TimeCapsule, clock: &Clock, viewer: address): String {
        assert!(clock::timestamp_ms(clock) >= capsule.unlock_time || viewer == capsule.owner, ENotUnlockTime);
        assert!(viewer == capsule.recipient || viewer == capsule.owner, ENotAuthorized);
        capsule.media_content
    }

    // 获取内容类型
    public fun get_content_type(capsule: &TimeCapsule): String {
        capsule.content_type
    }

    // 获取解锁时间
    public fun get_unlock_time(capsule: &TimeCapsule): u64 {
        capsule.unlock_time
    }

    // 获取拥有者
    public fun get_owner(capsule: &TimeCapsule): address {
        capsule.owner
    }

    // 获取接收者
    public fun get_recipient(capsule: &TimeCapsule): address {
        capsule.recipient
    }
}