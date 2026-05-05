import pandas as pd
import numpy as np
import time
import logging
import sys
from datetime import datetime
from uiautomation import WindowControl

# ==================== 配置区域 ====================
CONFIG = {
    'csv_file': '回复数据.csv',           # 回复数据文件路径
    'check_interval': 1.0,                # 检查新消息间隔（秒）
    'wechat_window_name': '微信',         # 微信窗口名称
    'session_list_name': '会话',          # 会话列表控件名称
    'message_list_name': '消息',          # 消息列表控件名称
    'default_reply': '我没有理解你的意思',  # 默认回复内容
    'enable_random_reply': True,          # 是否启用随机回复（当多个关键词匹配时）
}

# ==================== 日志配置 ====================
logging.basicConfig(
    level=logging.INFO,  # 改回 INFO 级别，减少DEBUG输出
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler('wechat_auto_reply.log', encoding='utf-8', mode='w'),  # 每次启动清空日志
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# ==================== 全局变量 ====================
running = True
last_processed_msg = None  # 记录最后处理的消息，避免重复回复
processed_messages = set()  # 记录所有已处理的消息内容


def signal_handler(sig, frame):
    """处理 Ctrl+C 信号"""
    global running
    logger.info("\n收到退出信号，正在关闭程序...")
    running = False


def load_reply_data(csv_file):
    """加载回复数据"""
    try:
        df = pd.read_csv(csv_file, encoding='utf-8')
        
        # 验证必要的列是否存在
        if '关键词' not in df.columns or '回复内容' not in df.columns:
            raise ValueError("CSV文件必须包含'关键词'和'回复内容'两列")
        
        # 删除空行
        df.dropna(subset=['关键词', '回复内容'], inplace=True)
        
        logger.info(f"成功加载 {len(df)} 条回复规则")
        logger.debug(f"回复数据预览:\n{df.head()}")
        return df
    
    except FileNotFoundError:
        logger.error(f"找不到文件: {csv_file}")
        logger.info("请创建回复数据CSV文件，格式如下:")
        logger.info("关键词,回复内容")
        logger.info("你好,您好！很高兴为您服务")
        logger.info("价格,我们的产品价格是XXX元")
        sys.exit(1)
    
    except Exception as e:
        logger.error(f"加载回复数据失败: {e}")
        sys.exit(1)


def find_matching_replies(last_msg, df):
    """查找匹配的回复内容"""
    matched_replies = []
    
    for _, row in df.iterrows():
        keyword = str(row['关键词']).strip()
        reply = str(row['回复内容']).strip()
        
        # 检查关键词是否在消息中
        if keyword and keyword in last_msg:
            matched_replies.append(reply)
            logger.debug(f"匹配到关键词: '{keyword}' -> 回复: '{reply[:30]}...'")
    
    return matched_replies


def send_reply(wx, reply_content):
    """发送回复消息"""
    try:
        # 替换换行符标记
        formatted_reply = reply_content.replace('{br}', '{Shift}{Enter}')
        
        # 发送回复内容
        wx.SendKeys(formatted_reply, waitTime=0.5)
        wx.SendKeys('{Enter}', waitTime=0.5)
        
        logger.info(f"✓ 已发送回复: {reply_content[:50]}{'...' if len(reply_content) > 50 else ''}")
        return True
    
    except Exception as e:
        logger.error(f"发送回复失败: {e}")
        return False


def process_message(wx, hw, df):
    """处理新消息"""
    global last_processed_msg
    
    try:
        # 获取消息列表
        msg_list = wx.ListControl(Name=CONFIG['message_list_name'])
        if not msg_list.Exists(0.5):
            return
        
        children = msg_list.GetChildren()
        if not children:
            return
        
        # 获取最后一条消息
        last_msg_control = children[-1]
        if not last_msg_control or not last_msg_control.Name:
            return
        
        message_content = last_msg_control.Name.strip()
        
        # 避免重复处理同一条消息（使用集合去重）
        if message_content in processed_messages:
            return
        
        logger.info(f"\n{'='*50}")
        logger.info(f"📨 收到新消息: {message_content}")
        logger.info(f"{'='*50}")
        
        # 查找匹配的回复
        logger.info(f"正在匹配关键词... (共 {len(df)} 条规则)")
        matched_replies = find_matching_replies(message_content, df)
        
        replied = False  # 标记是否已发送回复
        
        if matched_replies:
            logger.info(f"✅ 找到 {len(matched_replies)} 个匹配的回复")
            
            # 选择回复内容
            if CONFIG['enable_random_reply'] and len(matched_replies) > 1:
                selected_reply = np.random.choice(matched_replies)
                logger.info(f"🎲 从 {len(matched_replies)} 个匹配中随机选择回复")
            else:
                selected_reply = matched_replies[0]
                logger.info(f"📝 使用第一个匹配的回复")
            
            # 发送回复
            logger.info("正在发送回复...")
            if send_reply(wx, selected_reply):
                replied = True
        else:
            # 没有匹配，发送默认回复
            logger.info("❌ 未找到匹配的关键词")
            logger.info(f"💬 发送默认回复: {CONFIG['default_reply']}")
            if send_reply(wx, CONFIG['default_reply']):
                replied = True
        
        # 只有成功发送回复后才标记为已处理
        if replied:
            processed_messages.add(message_content)
            last_processed_msg = message_content
            logger.info(f"✓ 消息已标记为已处理")
        
        logger.info(f"{'='*50}\n")
    
    except Exception as e:
        logger.error(f"处理消息时出错: {e}", exc_info=True)


def main():
    """主函数"""
    global running
    
    print("=" * 60)
    print("🤖 微信自动回复机器人 v2.0")
    print("=" * 60)
    print(f"⏰ 启动时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📝 日志文件: wechat_auto_reply.log")
    print(f"⚙️  检查间隔: {CONFIG['check_interval']} 秒")
    print(f"🎲 随机回复: {'开启' if CONFIG['enable_random_reply'] else '关闭'}")
    print("=" * 60)
    print("💡 提示: 按 Ctrl+C 退出程序")
    print("=" * 60)
    
    # 注册信号处理器
    import signal
    signal.signal(signal.SIGINT, signal_handler)
    
    # 加载回复数据
    df = load_reply_data(CONFIG['csv_file'])
    
    # 连接微信
    try:
        logger.info("正在连接微信...")
        
        # 尝试多次连接微信
        wx = None
        max_retries = 3
        for attempt in range(max_retries):
            try:
                logger.info(f"尝试连接微信 (第 {attempt + 1}/{max_retries} 次)...")
                wx = WindowControl(Name=CONFIG['wechat_window_name'])
                
                # 检查窗口是否存在，设置较短的超时时间
                if wx.Exists(2):  # 2秒超时
                    logger.info("✓ 成功找到微信窗口")
                    break
                else:
                    logger.warning(f"第 {attempt + 1} 次尝试未找到微信窗口")
                    time.sleep(1)
            except Exception as e:
                logger.warning(f"第 {attempt + 1} 次尝试失败: {e}")
                time.sleep(1)
        
        if wx is None or not wx.Exists(0):
            logger.error("❌ 无法连接到微信窗口")
            logger.error("\n请检查:")
            logger.error("   1. 微信桌面版是否已启动并登录")
            logger.error("   2. 微信窗口是否被最小化（请恢复窗口）")
            logger.error("   3. 是否需要以管理员权限运行此脚本")
            logger.error("   4. Windows UI自动化功能是否已启用")
            sys.exit(1)
        
        # 切换到微信窗口
        logger.info("正在切换到微信窗口...")
        try:
            wx.SwitchToThisWindow()
            logger.info("✓ 成功切换到微信窗口")
        except Exception as e:
            logger.warning(f"切换窗口时出现警告: {e}")
            logger.info("继续尝试操作...")
        
        # 获取会话列表
        logger.info("正在查找会话列表...")
        hw = wx.ListControl(Name=CONFIG['session_list_name'])
        
        # 等待会话列表出现
        if not hw.Exists(5):
            logger.error("❌ 未找到会话列表控件")
            logger.error("\n可能的原因:")
            logger.error("   1. 微信界面布局与预期不符")
            logger.error("   2. 微信版本过新或过旧")
            logger.error("   3. 需要重新定位控件名称")
            sys.exit(1)
        
        logger.info("✓ 成功找到会话列表")
        logger.info("✅ 初始化完成，开始监听新消息...\n")
        
        # 主循环
        while running:
            process_message(wx, hw, df)
            time.sleep(CONFIG['check_interval'])
    
    except KeyboardInterrupt:
        logger.info("\n用户中断程序")
    
    except Exception as e:
        logger.error(f"程序运行出错: {e}", exc_info=True)
    
    finally:
        logger.info("程序已退出")
        print("\n" + "=" * 60)
        print("👋 感谢使用微信自动回复机器人")
        print("=" * 60)


if __name__ == '__main__':
    main()